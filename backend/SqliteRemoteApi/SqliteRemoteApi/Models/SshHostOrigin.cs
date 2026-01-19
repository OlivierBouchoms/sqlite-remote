using System.Text.Json.Serialization;

namespace SqliteRemoteApi.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SshHostOrigin
{
    SshConfig,
    Inline,
}