namespace SqliteRemoteApi.Models;

public record DatabaseQueryInput(string HostName, string DbPath, string CommandText);