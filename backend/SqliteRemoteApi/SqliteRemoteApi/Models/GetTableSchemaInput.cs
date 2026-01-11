namespace SqliteRemoteApi.Models;

public record GetTableSchemaInput(string Table, SshHostInput Host, string DbPath);
