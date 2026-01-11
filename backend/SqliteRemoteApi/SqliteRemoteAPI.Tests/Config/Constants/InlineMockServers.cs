using SqliteRemoteAPI.Tests.Config.Data;

namespace SqliteRemoteAPI.Tests.Config.Constants;

public class InlineMockServers
{
    private static InlineMockServer Alpine3_23 = new("localhost", "root", 4023, "~/.ssh/id_sqlite_remote");
    
    public static readonly IReadOnlyCollection<InlineMockServer> All = [Alpine3_23];
}