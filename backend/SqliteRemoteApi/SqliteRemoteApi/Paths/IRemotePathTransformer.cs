using Renci.SshNet;

namespace SqliteRemoteApi.Paths;

public interface IRemotePathTransformer
{
    Task<string> GetAbsolutePath(string path, ISshClient sshClient, CancellationToken cancelToken);
}