using Microsoft.Extensions.Options;
using SqliteRemoteApi.Models;
using SqliteRemoteApi.Options;
using SqliteRemoteApi.Paths;

namespace SqliteRemoteApi.Parser;

public class SshConfigParser(ILocalPathTransformer pathTransformer, IOptions<NetworkOptions> networkOptions, ILogger<SshConfigParser> logger) : ISshConfigParser
{
    /// <summary>
    /// Parses the SSH config file located at the given path.
    /// </summary>
    /// <returns>SshConfig instance</returns>
    public async Task<SshConfig> Parse(string path)
    {
        var hosts = new List<SshHost>();

        var absolutePath = path.StartsWith('~')
            ? Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), path[1..])
            : path;

        var lines = await File.ReadAllLinesAsync(absolutePath);

        for (var index = 0; index < lines.Length; index++)
        {
            var line = lines[index];
            if (line.StartsWith("Host "))
            {
                hosts.Add(ParseHost(lines, ref index));
            }
        }

        return new SshConfig(absolutePath, hosts);
    }

    /// <summary>
    /// Parses a single Host entry from the ssh config file.
    /// </summary>
    /// <returns>SshHost instance</returns>
    SshHost ParseHost(string[] lines, ref int index)
    {
        var host = lines[index].Substring("Host ".Length).Trim();

        var sshHost = new SshHost
        {
            Name = host,
            HostName = host,
            Port = 22,
            Origin = SshHostOrigin.SshConfig
        };

        index++;

        for (; index < lines.Length; index++)
        {
            var line = lines[index].Trim();
            if (line.StartsWith("HostName "))
            {
                var rawHostName = line.Substring("HostName ".Length).Trim();
                sshHost.HostName = TranslateHostName(rawHostName);
            }
            else if (line.StartsWith("User "))
            {
                sshHost.User = line.Substring("User ".Length).Trim();
            }
            else if (line.StartsWith("IdentityFile "))
            {
                var identityFilePath = line.Substring("IdentityFile ".Length).Trim();

                sshHost.IdentityFile = pathTransformer.GetAbsolutePath(identityFilePath);
            }
            else if (line.StartsWith("Port "))
            {
                if (int.TryParse(line.Substring("Port ".Length).Trim(), out var port))
                    sshHost.Port = port;
            }
            else if (line.StartsWith("Host ")) // reached next host
            {
                index--;
                break;
            }
        }
        
        if (string.IsNullOrEmpty(sshHost.User)) throw new Exception($"SSH host {sshHost.Name} is missing a User entry.");
        if (string.IsNullOrEmpty(sshHost.IdentityFile)) throw new Exception($"SSH host {sshHost.Name} is missing a IdentityFile entry.");
        
        return sshHost;
    }
    
    string TranslateHostName(string hostName)
    {
        logger.LogInformation("Translating hostname {HostName}. Enabled: {TranslateLoopbackAddress}. HostGateway: {HostGateway}", hostName,
            networkOptions.Value.TranslateLoopbackAddress, networkOptions.Value.HostGateway);

        if (networkOptions.Value.TranslateLoopbackAddress &&
            networkOptions.Value.LoopbackAddresses.Contains(hostName, StringComparer.OrdinalIgnoreCase))
        {
            return networkOptions.Value.HostGateway;
        }

        return hostName;
    }
}