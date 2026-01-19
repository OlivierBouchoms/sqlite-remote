export type SshConfiguration = {
    hostName: string;
    port: number | undefined;
    username: string | undefined;
    identityFilePath: string | undefined;
};
