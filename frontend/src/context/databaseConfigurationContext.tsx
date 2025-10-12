import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { DatabaseConfiguration } from '../domain/model/databaseConfiguration.ts';
import { useGetDatabaseConfiguration } from '../domain/hooks/useGetDatabaseConfiguration.ts';
import { useTableServiceGetApiTable } from '../generated/api/queries';
import { DatabaseTable } from '../domain/types/databaseTable.ts';
import { QueryKey } from '../domain/hooks/common/QueryKey.ts';

export type DatabaseConfigurationContextValue = {
    selectedConfig: DatabaseConfiguration | null | undefined;
    setConfig: (id: string | undefined) => void;
    isConfigLoading: boolean;
    error: unknown;
    selectedTable: DatabaseTable | undefined;
    setSelectedTable: (table: DatabaseTable | undefined) => void;
    tables: Array<DatabaseTable> | undefined;
    isTablesLoading: boolean;
    tablesError: unknown;
};

export function DatabaseConfigurationContextProvider({ children }: PropsWithChildren) {
    const [id, setId] = useState<string>();
    const [selectedTable, setSelectedTable] = useState<{ name: string }>();

    const { data: config, isLoading: isConfigLoading, error } = useGetDatabaseConfiguration(id);

    const {
        data: tables,
        isLoading: isTablesLoading,
        error: tablesError,
    } = useTableServiceGetApiTable(
        {
            dbPath: config?.dbPath,
            sshHost: config?.ssh.hostName,
        },
        [QueryKey.DatabaseTables, config?.id],
        {
            enabled: !!config,
        }
    );

    return (
        <DatabaseConfigurationContext.Provider
            value={{
                selectedConfig: config,
                setConfig: setId,
                isConfigLoading,
                error,
                selectedTable,
                setSelectedTable,
                tables: tables?.tables,
                isTablesLoading,
                tablesError,
            }}
        >
            {children}
        </DatabaseConfigurationContext.Provider>
    );
}

const DatabaseConfigurationContext = createContext<DatabaseConfigurationContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useDatabaseConfiguration() {
    const context = useContext(DatabaseConfigurationContext);
    if (!context) {
        throw new Error('useDatabaseConfigurationContext must be used within a DatabaseConfigurationContextProvider');
    }
    return context;
}
