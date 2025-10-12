using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record TableSchemaRequestDto([param: Required] string SshHost, [param: Required] string DbPath);
