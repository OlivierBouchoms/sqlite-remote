using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record ServerConnectRequestDto([param: Required] string SshHost, [param: Required] string DbPath);
