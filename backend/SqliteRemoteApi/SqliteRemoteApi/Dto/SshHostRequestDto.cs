using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record SshHostRequestDto([param: Required] string HostName, string? User = null, int? Port = null, string? IdentityFilePath = null);