using Renci.SshNet;

namespace SqliteRemoteApi.Paths;

public interface ILocalPathTransformer
{
    string GetAbsolutePath(string path);
}