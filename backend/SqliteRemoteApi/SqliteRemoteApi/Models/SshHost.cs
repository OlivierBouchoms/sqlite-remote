namespace SqliteRemoteApi.Models;

public class SshHost
{
    public required string Name { get; init; }
    
    public required string HostName { get; set; }
    
    public required int Port { get; set; }

    public string User { get; set; } = null!;

    public string IdentityFile { get; set; } = null!;
}