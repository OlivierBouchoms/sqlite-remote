import { DatabaseOverviewPage } from '../../pages/databaseOverview';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';

export const DatabaseOverviewRoute = () => {
    const { databaseId } = useParams();

    const { setConfig, setSelectedTable } = useDatabaseConfiguration();

    useEffect(() => {
        setConfig(databaseId!);
        setSelectedTable(undefined);
    }, [databaseId, setConfig, setSelectedTable]);

    return <DatabaseOverviewPage />;
};
