using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record TableIndexRequestDto([param: Required] string SshHost, [param: Required] string DbPath);
