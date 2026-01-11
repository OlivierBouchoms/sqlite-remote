namespace SqliteRemoteApi.Models;

public record SshHostInput(string HostName, string? User, int? Port, string? IdentityFilePath = null);
