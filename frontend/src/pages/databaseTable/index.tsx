import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { Skeleton } from '@radix-ui/themes';
import { DatabaseConnectionStatus } from '../../components/databaseConnectionStatus';
import { Page } from '../../components/page';
import { SegmentedControl, SegmentedControlItem } from '../../components/segmentedControl';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { routes } from '../../domain/urls/routes.ts';
import { PageHeader } from '../../components/pageHeader';
import { TableSchemaSegment } from '../../features/tableSchemaSegment';
import { FaArrowLeft, FaSync } from 'react-icons/fa';
import { PageContent } from '../../components/pageContent';
import { TableDataSegment } from '../../features/tableDataSegment';
import { useTableServiceGetApiTableByNameData, useTableServiceGetApiTableByNameSchema } from '../../generated/api/queries';
import { QueryKey } from '../../domain/hooks/common/QueryKey.ts';

export type DatabaseTablePageSegment = 'data' | 'schema';

export const DatabaseTablePage = () => {
    const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
    const [isSchemaLoading, setIsSchemaLoading] = useState<boolean>(true);

    const [searchParams, setSearchParams] = useSearchParams();

    const { isConfigLoading, selectedConfig, selectedTable } = useDatabaseConfiguration();

    const { refetch: refetchTableData, isRefetching: isTableDataRefetching } = useTableServiceGetApiTableByNameData(
        {
            name: selectedTable?.name ?? '',
            sshHost: selectedConfig?.ssh.hostName,
            dbPath: selectedConfig?.dbPath,
        },
        [QueryKey.DatabaseTableData, selectedConfig?.ssh.hostName, selectedConfig?.dbPath, selectedTable]
    );

    const { refetch: refetchTableSchema, isRefetching: isTableSchemaRefetching } = useTableServiceGetApiTableByNameSchema(
        {
            name: selectedTable?.name ?? '',
            sshHost: selectedConfig?.ssh.hostName,
            dbPath: selectedConfig?.dbPath,
        },
        [QueryKey.DatabaseTableSchema, selectedConfig?.ssh.hostName, selectedConfig?.dbPath, selectedTable]
    );

    const { t } = useTranslation(undefined, { keyPrefix: 'pages.databaseTablePage' });

    const segmentedControlItems = useMemo((): SegmentedControlItem[] => {
        return [
            { value: 'data', label: t('segments.data') },
            { value: 'schema', label: t('segments.schema') },
        ];
    }, [t]);

    const segment = useMemo(() => {
        const segmentParam = searchParams.get('segment');

        const mappedSegment = segmentedControlItems.find((sc) => sc.value === segmentParam);

        return mappedSegment ?? segmentedControlItems[0];
    }, [searchParams, segmentedControlItems]);

    const setSegment = useCallback(
        (segment: string) => {
            if (!segmentedControlItems.find((sc) => sc.value === segment)) {
                return;
            }

            setSearchParams((p) => {
                p.set('segment', segment);
                return p;
            });
        },
        [segmentedControlItems, setSearchParams]
    );

    const onRefresh = useCallback(() => {
        switch (segment.value) {
            case 'data':
                refetchTableSchema();
                refetchTableData();
                break;
            case 'schema':
                refetchTableSchema();
                break;
        }
    }, [refetchTableData, refetchTableSchema, segment.value]);

    const isRefreshing = (segment.value === 'data' && isTableDataRefetching) || (segment.value === 'schema' && isTableSchemaRefetching);

    const isSegmentLoading = (segment.value === 'data' && isTableLoading) || (segment.value === 'schema' && isSchemaLoading);

    return (
        <Page>
            <PageHeader
                title={selectedTable?.name}
                loading={isConfigLoading}
                segmentLoading={isSegmentLoading}
                navigation={[
                    {
                        url: routes.database.detail(selectedConfig?.id ?? ''),
                        icon: <FaArrowLeft />,
                        alt: t('header.back'),
                    },
                    {
                        onClick: onRefresh,
                        icon: <FaSync />,
                        disabled: isRefreshing,
                        alt: t('header.refresh'),
                    },
                ]}
            >
                <Skeleton loading={isConfigLoading}>
                    <SegmentedControl items={segmentedControlItems} defaultValue={'data'} value={segment.value} onValueChange={setSegment} />
                </Skeleton>
                <Skeleton loading={isConfigLoading}>
                    <DatabaseConnectionStatus />
                </Skeleton>
            </PageHeader>
            <PageContent>
                <TableDataSegment active={segment.value === 'data'} onLoadingChange={setIsTableLoading} />
                <TableSchemaSegment active={segment.value === 'schema'} onLoadingChange={setIsSchemaLoading} />
            </PageContent>
        </Page>
    );
};
