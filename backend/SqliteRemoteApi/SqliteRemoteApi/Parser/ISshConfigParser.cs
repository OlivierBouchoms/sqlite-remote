using SqliteRemoteApi.Models;

namespace SqliteRemoteApi.Parser;

public interface ISshConfigParser
{
    Task<SshConfig> Parse(string path);
}