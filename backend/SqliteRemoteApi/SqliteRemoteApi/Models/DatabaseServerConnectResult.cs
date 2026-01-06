using Renci.SshNet;
using SqliteRemoteApi.Models.Base;

namespace SqliteRemoteApi.Models;

public record DatabaseServerConnectResult(ISshClient? Client, string? DbPath, bool Success, SshHost? SshHost, DatabaseOperationError? Error);
