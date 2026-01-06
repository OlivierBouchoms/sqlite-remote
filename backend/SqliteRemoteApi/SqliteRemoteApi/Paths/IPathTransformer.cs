using Renci.SshNet;

namespace SqliteRemoteApi.Paths;

public interface IPathTransformer
{
    Task<string> Transform(string path, ISshClient sshClient, CancellationToken cancelToken);
}