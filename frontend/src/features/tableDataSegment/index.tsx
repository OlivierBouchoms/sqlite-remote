import { Table, TableColumn } from '../../components/table';
import { useTableServiceGetApiTableByNameData, useTableServiceGetApiTableByNameSchema } from '../../generated/api/queries';
import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { QueryKey } from '../../domain/hooks/common/QueryKey.ts';
import { useEffect, useMemo, useState } from 'react';
import { ErrorCallout } from '../../components/errorCallout';

type TableSegmentProps = {
    active: boolean;
    onLoadingChange: (loading: boolean) => void;
};

export const TableDataSegment = ({ active, onLoadingChange }: TableSegmentProps) => {
    const [isTableRendering, setIsTableRendering] = useState<boolean>(false);

    const { selectedConfig, selectedTable } = useDatabaseConfiguration();

    const {
        data,
        isLoading: dataLoading,
        error,
        refetch: refetchData,
        isFetched: isDataFetched,
    } = useTableServiceGetApiTableByNameData(
        {
            name: selectedTable?.name ?? '',
            sshHost: selectedConfig?.ssh.hostName,
            dbPath: selectedConfig?.dbPath,
        },
        [QueryKey.DatabaseTableData, selectedConfig?.ssh.hostName, selectedConfig?.dbPath, selectedTable]
    );

    const {
        data: schemaData,
        isLoading: schemaLoading,
        error: schemaError,
        refetch: refetchSchema,
        isFetched: isSchemaFetched,
    } = useTableServiceGetApiTableByNameSchema(
        {
            name: selectedTable?.name ?? '',
            sshHost: selectedConfig?.ssh.hostName,
            dbPath: selectedConfig?.dbPath,
        },
        [QueryKey.DatabaseTableSchema, selectedConfig?.ssh.hostName, selectedConfig?.dbPath, selectedTable]
    );

    const columns = useMemo((): TableColumn[] | null => {
        if (!schemaData || !schemaData.columns) return null;

        return schemaData.columns.reduce(
            (columns, column) => {
                columns.push({
                    name: column.name,
                    selector: (data) => data[column.name],
                    primaryKey: column.primaryKey,
                    required: column.required,
                    type: column.type,
                });

                return columns;
            },
            [
                {
                    name: '#',
                    primaryKey: false,
                    required: false,
                    type: 'INTEGER',
                } satisfies TableColumn,
            ] as TableColumn[]
        );
    }, [schemaData]);

    useEffect(() => {
        const canFetch = !!selectedTable && !!selectedConfig;
        if (!isDataFetched && canFetch) refetchData();
        if (!isSchemaFetched && canFetch) refetchSchema();
    }, [isDataFetched, isSchemaFetched, refetchData, refetchSchema, selectedConfig, selectedTable]);

    useEffect(() => {
        onLoadingChange(dataLoading || schemaLoading || isTableRendering);
    }, [data, columns, isTableRendering, onLoadingChange, dataLoading, schemaLoading]);

    if (error && active) {
        return <ErrorCallout error={error} />;
    }

    if (schemaError && active) {
        return <ErrorCallout error={schemaError} />;
    }

    if (!data || !columns) return null;

    return <Table data={data.data as any[]} columns={columns} visible={active} onRenderingChange={setIsTableRendering} />;
};
