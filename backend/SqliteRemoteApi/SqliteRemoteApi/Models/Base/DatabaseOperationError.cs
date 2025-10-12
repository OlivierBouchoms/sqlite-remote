using System.Text.Json.Serialization;

namespace SqliteRemoteApi.Models.Base;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum DatabaseOperationError
{
    /// <summary>
    /// The SSH configuration for the specified host could not be found or could not be parsed.
    /// </summary>
    SshConfigInvalid,
    
    /// <summary>
    /// The SSH host could not be found in the SSH configuration.
    /// </summary>
    SshHostNotFound,
    
    /// <summary>
    /// The connection to the remote server failed.
    /// </summary>
    ConnectFailed,

    /// <summary>
    /// The connection to the remote server timed out.
    /// </summary>
    ConnectTimeOut,
    
    /// <summary>
    /// The Sqlite database file was not found on the remote server.
    /// </summary>
    DatabaseNotFound,
    
    /// <summary>
    /// A remote command execution involving the database failed.
    /// </summary>
    DatabaseCommandFailed,
        
    /// <summary>
    /// A remote command execution involving the database timed out.
    /// </summary>
    DatabaseCommandTimeOut,

    /// <summary>
    /// A remote command execution not involving the database (e.g. checking if a file exists) failed.
    /// </summary>
    RemoteCommandFailed,

    /// <summary>
    /// A remote command execution not involving the database (e.g. checking if a file exists) timed out.
    /// </summary>
    RemoteCommandTimeOut,
}