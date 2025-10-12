using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Dto;

public record TableIndexResponseDto([property: Required] ICollection<TableIndexTableDto> Tables);

public record TableIndexTableDto([property: Required] string Name);