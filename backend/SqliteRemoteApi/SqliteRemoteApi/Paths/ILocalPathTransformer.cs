using Renci.SshNet;

namespace SqliteRemoteApi.Paths;

public interface ILocalPathTransformer
{
    string Transform(string path);
}