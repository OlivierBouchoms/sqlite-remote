using Microsoft.Extensions.Options;
using Renci.SshNet;
using SqliteRemoteApi.Models;
using SqliteRemoteApi.Options;
using SshNet.Agent;

namespace SqliteRemoteApi.Factory;

public class SshClientFactory(ILogger<SshClientFactory> logger) : ISshClientFactory
{
    public ISshClient CreateSshClient(SshHost host)
    {
        if (TryGetPrivateKeyFile(host, out var privateKeyFile))
        {
            logger.LogInformation("Using private key file {IdentityFile} for SSH connection to {Name} ({Host}:{Port}) as user {User}",
                host.IdentityFile, host.Name, host.HostName, host.Port, host.User);

            return new SshClient(host.HostName, host.Port, host.User, privateKeyFile!);
        }

        logger.LogInformation("Using SSH agent for SSH connection to {Name} ({Host}:{Port}) as user {User}", host.HostName, host.Name, host.Port, host.User);

        var agent = new SshAgent();

        var keys = agent.RequestIdentities();

        return new SshClient(host.HostName, host.Port, host.User, keys);
    }


    bool TryGetPrivateKeyFile(SshHost host, out PrivateKeyFile? privateKeyFile)
    {
        privateKeyFile = null;

        if (string.IsNullOrEmpty(host.HostName) || string.IsNullOrEmpty(host.IdentityFile)) return false;

        if (!File.Exists(host.IdentityFile)) {
            logger.LogWarning("Private key file {IdentityFile} does not exist", host.IdentityFile);
            return false;
        }

        try
        {
            privateKeyFile = new PrivateKeyFile(host.IdentityFile);
            return true;
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Failed to load private key file from {IdentityFile}", host.IdentityFile);
            return false;
        }
    }
}