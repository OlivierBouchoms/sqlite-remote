import { ConnectionBadgeCopy } from '../../components/connectionBadge';
import { DatabaseTablePageSegment } from '../../pages/databaseTable';
import { DatabaseOperationError } from '../../generated/api/requests';

export const en = {
    translation: {
        domain: {
            app: {
                title: 'SQLite Remote',
                titleLogoAlt: 'SQLite Remote Logo',
            },
            api: {
                databaseOperationError: {
                    SshConfigInvalid: 'The SSH configuration for the specified host could not be found or could not be parsed.',
                    SshHostNotFound: 'The SSH host could not be found in the SSH configuration.',
                    ConnectFailed: 'The connection to the remote server failed.',
                    ConnectTimeOut: 'The connection to the remote server timed out.',
                    DatabaseNotFound: 'The database file was not found on the remote server.',
                    DatabaseCommandFailed: 'A remote command execution involving the database failed.',
                    DatabaseCommandTimeOut: 'A remote command execution involving the database timed out.',
                    RemoteCommandFailed: 'A remote command execution failed.',
                    RemoteCommandTimeOut: 'A remote command execution timed out.',
                } satisfies Record<DatabaseOperationError, string>,
            },
        },
        features: {
            addDatabaseConfiguration: {
                dialog: {
                    title: 'Add data source',
                },
                form: {
                    type: {
                        label: 'Type',
                        placeholder: 'SQLite',
                    },
                    label: {
                        label: 'Label',
                        placeholder: 'My awesome database',
                    },
                    remoteHost: {
                        label: 'Host',
                        description: 'Name of the remote host, according to your SSH config file (~/.ssh/config)',
                        placeholder: 'my-remote-host',
                    },
                    dbPath: {
                        label: 'SQLite file',
                        description: 'Path to the database file on the remote host',
                        placeholder: '/path/to/database.sqlite',
                    },
                    actions: {
                        cancel: 'Cancel',
                        submit: 'Add',
                    },
                },
            },
            tableSchemaSegment: {
                columns: {
                    name: 'Name',
                    type: 'Type',
                    required: 'Required',
                    defaultValue: 'Default',
                    primaryKey: 'PK',
                },
            },
        },
        nav: {
            databases: {
                title: 'Data sources',
                contextMenu: {
                    open: 'Open',
                    refresh: 'Refresh',
                },
            },
            tables: {
                title: 'Tables',
                contextMenu: {
                    open: 'Open',
                    refresh: 'Refresh',
                },
            },
        },
        ui: {
            toast: {
                error: 'An error has occurred',
            },
        },
        pages: {
            databaseTablePage: {
                header: {
                    back: 'Back to data source',
                    refresh: 'Refresh',
                },
                segments: {
                    data: 'Data',
                    schema: 'Schema',
                } satisfies Record<DatabaseTablePageSegment, string>,
            },
            error: {
                title: 'Error',
                description: 'An unknown error has occurred',
                cta: 'Back to home page',
            },
        },
        components: {
            connectionBadge: {
                success: 'Connected',
                failure: 'Connection failed',
                connecting: 'Connecting',
            } satisfies ConnectionBadgeCopy,
            databaseConnectionTest: {
                title: 'Connection status',
                test: 'Test connection',
                table: {
                    hostName: 'Address',
                    port: 'Port',
                    user: 'User',
                },
                connectionBadge: {
                    success: 'Connection succeeded',
                    failure: 'Connection failed',
                    connecting: 'Connecting',
                } satisfies ConnectionBadgeCopy,
            },
            errorCallout: {
                problemDetails: {
                    title: '{{title}} (HTTP {{status}})',
                },
                fallback: {
                    title: 'An unknown error has occurred',
                },
            },
            table: {
                cell: {
                    placeholder: {
                        blob: '[blob]',
                    },
                },
            },
            queryConsole: {
                label: 'Query console',
                toolbar: {
                    execute: 'Execute',
                    copy: 'Copy',
                },
            },
        },
    },
};
