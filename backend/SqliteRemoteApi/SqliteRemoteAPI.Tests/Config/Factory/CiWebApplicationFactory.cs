using Meziantou.Extensions.Logging.Xunit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace SqliteRemoteAPI.Tests.Config.Factory;

public class CiWebApplicationFactory<TEntryPoint>(ITestOutputHelper output) : WebApplicationFactory<TEntryPoint> where TEntryPoint : class
{
    private static readonly XUnitLoggerOptions LoggerOptions = new()
    {
        IncludeCategory = true,
        IncludeLogLevel = true,
        IncludeScopes = true,
        TimestampFormat = "HH:mm:ss",
    };
    
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("ci");
        builder.ConfigureLogging(l => l.ClearProviders().AddProvider(new XUnitLoggerProvider(output, LoggerOptions)));
    }
}