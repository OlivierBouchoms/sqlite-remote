using System.ComponentModel.DataAnnotations;
using System.Text.Json.Nodes;

namespace SqliteRemoteApi.Dto;

public record ServerQueryResponseDto([property: Required] ICollection<JsonArray> ResultSets);