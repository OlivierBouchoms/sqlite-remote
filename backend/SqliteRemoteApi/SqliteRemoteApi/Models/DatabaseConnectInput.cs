namespace SqliteRemoteApi.Models;

public record DatabaseConnectInput(SshHostInput Host, string DbPath);
