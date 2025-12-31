using System.Text.Json.Nodes;
using SqliteRemoteApi.Models.Base;

namespace SqliteRemoteApi.Models;

public record DatabaseQueryResult(ICollection<JsonArray> ResultSets, bool Success, SshHost? SshHost, string? DbPath, DatabaseOperationError? Error) : DatabaseOperationResult(Success, SshHost, DbPath, Error);