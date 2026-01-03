import { SshConfiguration } from './sshConfiguration.ts';
import { QueryConsoleConfiguration } from './queryConsoleConfiguration.ts';

export type DatabaseConfiguration = {
    id: string;
    label: string;
    dbPath: string;
    ssh: SshConfiguration;
    queryConsole: QueryConsoleConfiguration;
};
