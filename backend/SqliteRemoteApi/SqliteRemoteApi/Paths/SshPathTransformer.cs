using Renci.SshNet;

namespace SqliteRemoteApi.Paths;

public class SshPathTransformer : IRemotePathTransformer
{
    public async Task<string> GetAbsolutePath(string path, ISshClient sshClient, CancellationToken cancelToken)
    {
        if (!path.StartsWith("~")) return path;
        
        var homeFolderCommand = sshClient.CreateCommand("echo $HOME");
        
        await homeFolderCommand.ExecuteAsync(cancelToken);

        if (homeFolderCommand.ExitStatus == 0)
        {
            return Path.Join(homeFolderCommand.Result.Trim(), path[1..]);
        }

        throw new InvalidOperationException("Failed to retrieve home directory from remote server.");
    }
}