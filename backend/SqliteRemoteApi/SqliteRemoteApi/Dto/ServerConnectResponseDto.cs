using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record ServerConnectResponseDto([property: Required] DatabaseOperationSshHostDto SshHost, [property: Required] string DbPath);
