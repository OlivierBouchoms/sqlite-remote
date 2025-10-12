import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDatabaseConfiguration } from '../../../context/databaseConfigurationContext.tsx';
import { DatabaseTablePage } from '../../../pages/databaseTable';

export const DatabaseTableRoute = () => {
    const { databaseId, tableName } = useParams();

    const { setConfig, setSelectedTable } = useDatabaseConfiguration();

    useEffect(() => {
        setConfig(databaseId!);
        setSelectedTable({ name: tableName! });
    }, [databaseId, setConfig, setSelectedTable, tableName]);

    return <DatabaseTablePage />;
};
