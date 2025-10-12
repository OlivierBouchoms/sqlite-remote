namespace SqliteRemoteApi.Models;

public record SshConfig(string Path, List<SshHost> Hosts);
