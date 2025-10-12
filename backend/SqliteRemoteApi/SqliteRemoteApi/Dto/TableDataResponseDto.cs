using System.ComponentModel.DataAnnotations;
using System.Text.Json.Nodes;

namespace SqliteRemoteApi.Dto;

public record TableDataResponseDto([property: Required] JsonArray Data);
