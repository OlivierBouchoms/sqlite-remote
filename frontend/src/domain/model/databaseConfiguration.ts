import { SshConfiguration } from './sshConfiguration.ts';

export type DatabaseConfiguration = {
    id: string;
    label: string;
    dbPath: string;
    ssh: SshConfiguration;
};
