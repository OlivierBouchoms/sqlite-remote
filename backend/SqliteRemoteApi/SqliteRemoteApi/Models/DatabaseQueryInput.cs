namespace SqliteRemoteApi.Models;

public record DatabaseQueryInput(SshHostInput Host, string DbPath, string CommandText);