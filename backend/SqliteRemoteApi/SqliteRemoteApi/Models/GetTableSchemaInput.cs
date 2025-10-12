namespace SqliteRemoteApi.Models;

public record GetTableSchemaInput(string Table, string HostName, string DbPath);
