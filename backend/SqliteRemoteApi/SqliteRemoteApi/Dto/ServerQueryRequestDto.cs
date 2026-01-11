using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record ServerQueryRequestDto([param: Required] SshHostRequestDto Host, [param: Required] string DbPath, [param: Required] string CommandText);