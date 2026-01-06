using System.Text.Json.Nodes;
using Microsoft.OpenApi.Models;
using SqliteRemoteApi.Dto.Error;
using SqliteRemoteApi.Factory;
using SqliteRemoteApi.Manager;
using SqliteRemoteApi.Options;
using SqliteRemoteApi.Parser;
using SqliteRemoteApi.Paths;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "SqliteRemoteApi", Version = "v1" });
    c.MapType<JsonArray>(() => new OpenApiSchema { Type = "array", Items = new OpenApiSchema { Type = "object" }} );;
});
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(nameof(SqliteRemoteApi), policy =>
    {
        policy
            .WithHeaders(builder.Configuration.GetRequiredSection("Cors:AllowedHeaders").Get<string[]>() ?? [])
            .WithMethods(builder.Configuration.GetRequiredSection("Cors:AllowedMethods").Get<string[]>() ?? [])
            .WithOrigins(builder.Configuration.GetRequiredSection("Cors:AllowedOrigins").Get<string[]>() ?? [])
            .SetPreflightMaxAge(TimeSpan.FromMinutes(5));
    });
});

builder.Services.AddOptions<NetworkOptions>()
    .BindConfiguration("Network")
    .ValidateDataAnnotations();

builder.Services.AddOptions<SshOptions>()
    .BindConfiguration("Ssh")
    .ValidateDataAnnotations();

builder.Services.AddSingleton<IDatabaseManager, SqLiteDatabaseManager>();
builder.Services.AddSingleton<IPathTransformer, RemotePathTransformer>();
builder.Services.AddSingleton<ISshConfigParser, SshConfigParser>();
builder.Services.AddSingleton<ISshClientFactory, SshClientFactory>();

builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Extensions.TryAdd("detailContext", context.HttpContext.Items[nameof(DatabaseErrorResponseDto.DetailContext)]);
    };
});
var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(nameof(SqliteRemoteApi));

app.MapControllers();

app.Run();

public partial class Program { }