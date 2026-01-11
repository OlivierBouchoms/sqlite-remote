using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record ServerConnectRequestDto([param: Required] SshHostRequestDto Host, [param: Required] string DbPath);