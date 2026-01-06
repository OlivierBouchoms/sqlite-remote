using System.ComponentModel.DataAnnotations;

namespace SqliteRemoteApi.Options;

public record NetworkOptions
{
    [Required]
    public string HostGateway { get; init; } = string.Empty;

    [Required]
    public bool TranslateLoopbackAddress { get; init; } = false;

    public IReadOnlyList<string> LoopbackAddresses { get; init; } = new List<string>
    {
        "127.0.0.1",
        "::1",
        "localhost"
    };
}