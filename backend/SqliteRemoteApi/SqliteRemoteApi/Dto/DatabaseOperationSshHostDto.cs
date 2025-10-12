using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record DatabaseOperationSshHostDto(
    [property: Required] string Name,
    [property: Required] string HostName,
    [property: Required] int Port,
    [property: Required] string User)
{
    public static DatabaseOperationSshHostDto From(Models.SshHost? sshHost)
    {
        if (sshHost == null)
            throw new ArgumentNullException(nameof(sshHost));

        return new(sshHost.Name, sshHost.HostName, sshHost.Port, sshHost.User);
    }
}