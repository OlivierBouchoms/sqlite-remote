namespace SqliteRemoteApi.Models;

public record GetTableDataInput(string Table, SshHostInput Host, string DbPath);
