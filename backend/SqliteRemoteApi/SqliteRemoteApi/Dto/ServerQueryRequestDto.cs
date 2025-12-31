using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record ServerQueryRequestDto([param: Required] string SshHost, [param: Required] string DbPath, [param: Required] string CommandText);