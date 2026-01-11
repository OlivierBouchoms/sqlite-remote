using Renci.SshNet;

namespace SqliteRemoteApi.Paths;

public interface IRemotePathTransformer
{
    Task<string> Transform(string path, ISshClient sshClient, CancellationToken cancelToken);
}