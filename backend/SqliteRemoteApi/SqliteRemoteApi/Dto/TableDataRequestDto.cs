using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record TableDataRequestDto([param: Required] string SshHost, [param: Required] string DbPath);
