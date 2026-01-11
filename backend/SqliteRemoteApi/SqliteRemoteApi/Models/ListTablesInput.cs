namespace SqliteRemoteApi.Models;

public record ListTablesInput(SshHostInput Host, string DbPath);   
