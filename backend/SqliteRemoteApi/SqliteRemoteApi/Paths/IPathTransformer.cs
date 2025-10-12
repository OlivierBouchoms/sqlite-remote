using Renci.SshNet;

namespace SqliteRemoteApi.Paths;

public interface IPathTransformer
{
    Task<string> Transform(string path, SshClient sshClient, CancellationToken cancelToken);
}