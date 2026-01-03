using System.Net.Http.Json;
using System.Text.Json;

namespace SqliteRemoteAPI.Tests.Config.Verify;

public static class VerifyExtensions
{
    private static readonly JsonSerializerOptions JsonSerializerOptions = new() { WriteIndented = true };

    /// <summary>
    /// Converts the response content to JSON and verifies it with the provided settings.
    /// As some responses use JsonArray / JsonObject instanced, the default serialization method won't emit the raw response body.
    /// We want to obtain the raw response body and pretty print it instead.
    /// </summary>
    /// <param name="response">The HttpResponseMessage obtained from executing the request</param>
    /// <param name="settings">VerifySettings instance</param>
    /// <param name="customizeFunc">Optional function to customize the method call chain (e.g. to use parameters)</param>
    /// <typeparam name="TResponse">The type of the response</typeparam>
    public static async Task VerifyAndFormat<TResponse>(HttpResponseMessage response, VerifySettings settings, Func<SettingsTask, SettingsTask> customizeFunc = null)
    {
        customizeFunc ??= v => v;
        
        var responseBody = await response.Content.ReadFromJsonAsync<TResponse>();

        var responseBodyJson = JsonSerializer.Serialize(responseBody, JsonSerializerOptions);

        await customizeFunc(Verifier.Verify(responseBodyJson, settings));
    }
}