import { Table, TableColumn } from '../../components/table';
import { useTableServiceGetApiTableByNameSchema } from '../../generated/api/queries';
import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { QueryKey } from '../../domain/hooks/common/QueryKey.ts';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorCallout } from '../../components/errorCallout';

type TableSchemaSegmentProps = {
    active: boolean;
    onLoadingChange: (loading: boolean) => void;
};

export const TableSchemaSegment = ({ active, onLoadingChange }: TableSchemaSegmentProps) => {
    const [isTableRendering, setIsTableRendering] = useState<boolean>(false);

    const { selectedConfig, selectedTable } = useDatabaseConfiguration();

    const { data, isLoading, error, refetch, isFetched } = useTableServiceGetApiTableByNameSchema(
        {
            name: selectedTable?.name ?? '',
            sshHost: selectedConfig?.ssh.hostName,
            dbPath: selectedConfig?.dbPath,
        },
        [QueryKey.DatabaseTableSchema, selectedConfig?.ssh.hostName, selectedConfig?.dbPath, selectedTable]
    );

    const { t } = useTranslation(undefined, { keyPrefix: 'features.tableSchemaSegment' });

    const columns = useMemo((): TableColumn[] | null => {
        return [
            {
                name: t('columns.name'),
                type: 'TEXT',
                required: false,
                primaryKey: false,
                selector: (obj: TableColumn) => obj.name,
            },
            {
                name: t('columns.type'),
                type: 'TEXT',
                required: false,
                primaryKey: false,
                selector: (obj: TableColumn) => obj.type,
            },
            {
                name: t('columns.required'),
                type: 'TEXT',
                required: false,
                primaryKey: false,
                displayType: 'CHECKBOX',
                selector: (obj: TableColumn) => obj.required,
            },
            {
                name: t('columns.defaultValue'),
                type: 'TEXT',
                required: false,
                primaryKey: false,
                selector: (obj: TableColumn) => obj.defaultValue ?? null,
            },
            {
                name: t('columns.primaryKey'),
                type: 'TEXT',
                required: false,
                primaryKey: false,
                displayType: 'CHECKBOX',
                selector: (obj: TableColumn) => obj.primaryKey,
            },
        ];
    }, [t]);

    useEffect(() => {
        const canFetchData = !!selectedTable && !!selectedConfig;
        if (!isFetched && canFetchData) refetch();
    }, [isFetched, refetch, selectedConfig, selectedTable]);

    useEffect(() => {
        onLoadingChange(isLoading || isTableRendering);
    }, [isLoading, isTableRendering, onLoadingChange]);

    if (error && active) {
        return <ErrorCallout error={error} />;
    }

    if (!data || !columns) return null;

    return <Table data={data.columns} columns={columns} visible={active} onRenderingChange={setIsTableRendering} />;
};
