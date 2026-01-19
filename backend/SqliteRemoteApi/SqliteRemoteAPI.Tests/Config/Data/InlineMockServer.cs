namespace SqliteRemoteAPI.Tests.Config.Data;

public record InlineMockServer(string HostName, string User, int Port, string IdentityFilePath)
{
    public override string ToString()
    {
        return string.Join("_", HostName, User, Port);
    }
}