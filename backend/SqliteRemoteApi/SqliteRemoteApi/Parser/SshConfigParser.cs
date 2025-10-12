using SqliteRemoteApi.Models;

namespace SqliteRemoteApi.Parser;

public class SshConfigParser : ISshConfigParser
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
        var sshHost = new SshHost();
        sshHost.Name = lines[index].Substring("Host ".Length).Trim();
        sshHost.HostName = sshHost.Name;
        sshHost.Port = 22;

        index++;

        for (; index < lines.Length; index++)
        {
            var line = lines[index].Trim();
            if (line.StartsWith("HostName "))
            {
                sshHost.HostName = line.Substring("HostName ".Length).Trim();
            }
            else if (line.StartsWith("User "))
            {
                sshHost.User = line.Substring("User ".Length).Trim();
            }
            else if (line.StartsWith("IdentityFile "))
            {
                var identityFilePath = line.Substring("IdentityFile ".Length).Trim();

                sshHost.IdentityFile = identityFilePath.StartsWith('~')
                    ? Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), identityFilePath[1..])
                    : identityFilePath;
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
        
        return sshHost;
    }
}