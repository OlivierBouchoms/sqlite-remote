import { useServerServiceGetApiServerConnection } from '../../generated/api/queries';
import styles from './index.module.css';
import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { Skeleton } from '@radix-ui/themes';
import { ConnectionBadge } from '../connectionBadge';
import { DatabaseErrorResponseDto, ServerConnectResponseDto } from '../../generated/api/requests';

export const DatabaseConnectionStatus = () => {
    const { selectedConfig, isConfigLoading } = useDatabaseConfiguration();

    const {
        error: fetchConnectionError,
        isSuccess: fetchConnectionSuccess,
        isFetching: isFetchingConnection,
    } = useServerServiceGetApiServerConnection<ServerConnectResponseDto, { body?: DatabaseErrorResponseDto }>(
        {
            sshHost: selectedConfig?.ssh.hostName,
            dbPath: selectedConfig?.dbPath,
        },
        undefined,
        {
            enabled: !!selectedConfig,
            refetchInterval: 15_000,
        }
    );

    return (
        <div className={styles.root}>
            <Skeleton loading={isConfigLoading}>
                <ConnectionBadge
                    isConnected={fetchConnectionSuccess}
                    isFetching={isFetchingConnection}
                    error={fetchConnectionError}
                    displayRealtimeFeedback={false}
                />
            </Skeleton>
        </div>
    );
};
