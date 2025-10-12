import { Button } from '@radix-ui/themes';
import { DataList } from '../dataList';
import { useServerServiceGetApiServerConnection } from '../../generated/api/queries';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import { ConnectionBadge } from '../connectionBadge';
import { QueryKey } from '../../domain/hooks/common/QueryKey.ts';
import { DatabaseErrorResponseDto, ServerConnectResponseDto } from '../../generated/api/requests';
import { ErrorCallout } from '../errorCallout';
import { FormLabel } from '../form/label';

type DatabaseConnectionTestProps = {
    form: {
        fieldNames: {
            hostName: string;
            dbPath: string;
        };
        isValid: boolean;
        watch: (field: string) => any;
    };
};

export const DatabaseConnectionTest = ({ form }: DatabaseConnectionTestProps) => {
    const {
        data: fetchConnectionData,
        error: fetchConnectionError,
        isSuccess: fetchConnectionSuccess,
        refetch: fetchConnection,
        isFetching: isFetchingConnection,
    } = useServerServiceGetApiServerConnection<ServerConnectResponseDto, { body?: DatabaseErrorResponseDto }>(
        {
            sshHost: form.watch(form.fieldNames.hostName),
            dbPath: form.watch(form.fieldNames.dbPath),
        },
        [QueryKey.DatabaseConnection, form.watch(form.fieldNames.hostName), form.watch(form.fieldNames.dbPath)]
    );

    const { t } = useTranslation(undefined, { keyPrefix: 'components.databaseConnectionTest' });

    return (
        <div className={styles.root}>
            <FormLabel htmlFor='databaseConnectionTest' text={t('title')} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Button onClick={() => fetchConnection()} disabled={!form.isValid || isFetchingConnection} type='button' variant='surface'>
                    {t('test')}
                </Button>
                <ConnectionBadge
                    isConnected={fetchConnectionSuccess}
                    isFetching={isFetchingConnection}
                    error={fetchConnectionError}
                    displayRealtimeFeedback={true}
                    copy={{
                        connecting: t('connectionBadge.connecting'),
                        failure: t('connectionBadge.failure'),
                        success: t('connectionBadge.success'),
                    }}
                />
            </div>
            {fetchConnectionSuccess && fetchConnectionData && (
                <DataList
                    items={[
                        {
                            label: t('table.hostName'),
                            value: fetchConnectionData.sshHost.hostName,
                        },
                        {
                            label: t('table.port'),
                            value: fetchConnectionData.sshHost.port,
                        },
                        { label: t('table.user'), value: fetchConnectionData.sshHost.user },
                    ]}
                />
            )}
            {!!fetchConnectionError && <ErrorCallout error={fetchConnectionError} />}
        </div>
    );
};
