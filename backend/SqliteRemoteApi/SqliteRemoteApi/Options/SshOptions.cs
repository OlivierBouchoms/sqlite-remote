using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Options;

public record SshOptions
{
    [Required]
    public string ConfigPath { get; init; } = string.Empty;
}