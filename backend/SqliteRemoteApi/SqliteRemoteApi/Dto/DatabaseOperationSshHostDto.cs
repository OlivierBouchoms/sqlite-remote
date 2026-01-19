using System.ComponentModel.DataAnnotations;
using SqliteRemoteApi.Models;

namespace SqliteRemoteApi.Dto;

public record DatabaseOperationSshHostDto(
    [property: Required] string Name,
    [property: Required] string HostName,
    [property: Required] int Port,
    [property: Required] SshHostOrigin Origin,
    [property: Required] string User)
{
    public static DatabaseOperationSshHostDto From(SshHost? sshHost)
    {
        if (sshHost == null)
            throw new ArgumentNullException(nameof(sshHost));

        return new(sshHost.Name, sshHost.HostName, sshHost.Port, sshHost.Origin, sshHost.User);
    }
    
    public static DatabaseOperationSshHostDto? FromOrDefault(SshHost? sshHost)
    {
        if (sshHost == null) return null;

        return new(sshHost.Name, sshHost.HostName, sshHost.Port, sshHost.Origin, sshHost.User);
    }
}