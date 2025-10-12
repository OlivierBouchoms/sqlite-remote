using System.ComponentModel.DataAnnotations;
using SqliteRemoteApi.Models;

namespace SqliteRemoteApi.Dto;

public record TableSchemaResponseDto([property: Required] ICollection<TableSchemaColumnDto> Columns);

public record TableSchemaColumnDto([property: Required] int ColumnId, [property: Required] string Name, [property: Required] TableSchemaColumnType Type, [property: Required] bool Required, [property: Required] object? DefaultValue, [property: Required] bool PrimaryKey);