using SqliteRemoteApi.Models.Base;

namespace SqliteRemoteApi.Models;

public record DatabaseConnectResult(bool Success, SshHost? SshHost, string? DbPath, DatabaseOperationError? Error) : DatabaseOperationResult(Success, SshHost, DbPath, Error);
