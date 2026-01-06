using Renci.SshNet;
using SqliteRemoteApi.Models;

namespace SqliteRemoteApi.Factory;

public interface ISshClientFactory
{
    ISshClient CreateSshClient(SshHost host);
}