namespace SqliteRemoteApi.Models.Base;

public record DatabaseOperationResult(bool Success, SshHost? SshHost, string? DbPath, DatabaseOperationError? Error);
