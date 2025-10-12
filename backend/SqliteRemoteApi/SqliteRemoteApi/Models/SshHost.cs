namespace SqliteRemoteApi.Models;

public class SshHost
{
    public string Name { get; set; }
    
    public string HostName { get; set; }
    
    public int Port { get; set; } = 22;
    
    public string User { get; set; }
    
    public string IdentityFile { get; set; }
}