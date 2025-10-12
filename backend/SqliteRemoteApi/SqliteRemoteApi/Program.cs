using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using SqliteRemoteApi.Manager;
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


builder.Services.AddSingleton<IDatabaseManager, SqLiteDatabaseManager>();
builder.Services.AddSingleton<IPathTransformer, RemotePathTransformer>();
builder.Services.AddSingleton<ISshConfigParser, SshConfigParser>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(nameof(SqliteRemoteApi));

app.MapControllers();

app.Run();