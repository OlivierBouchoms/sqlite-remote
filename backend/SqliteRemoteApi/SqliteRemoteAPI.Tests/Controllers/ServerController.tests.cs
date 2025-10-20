using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.WebUtilities;
using SqliteRemoteApi.Dto;
using SqliteRemoteApi.Models.Base;
using SqliteRemoteAPI.Tests.Config.Constants;
using SqliteRemoteAPI.Tests.Config.Data;
using SqliteRemoteAPI.Tests.Config.Factory;
using Xunit.Abstractions;

namespace SqliteRemoteAPI.Tests.Controllers;

public partial class ServerControllerTests(ITestOutputHelper output)
{
    private readonly WebApplicationFactory<Program> _factory = new CiWebApplicationFactory<Program>(output);

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task GET_Server_Connect_ShouldReturn200_WhenValidRequest(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerConnectRequestDto(host, MockDatabase.Path);

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { nameof(requestDto.SshHost), requestDto.SshHost },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerConnectResponseDto>();

        Assert.Equal(requestDto.DbPath, responseData.DbPath);
    }
    
    [Fact]
    public async Task GET_Server_Connect_ShouldReturn500_SshHostNotFound_WhenInvalidHost()
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerConnectRequestDto("unknown", MockDatabase.Path);

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { nameof(requestDto.SshHost), requestDto.SshHost },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);
        var responseData = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        
        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(nameof(DatabaseOperationError.SshHostNotFound), responseData.Detail);
    }
    
    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task GET_Server_Connect_ShouldReturn500_DatabaseNotFound_WhenInvalidPath(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerConnectRequestDto(host, "/db/unknown.db");

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { nameof(requestDto.SshHost), requestDto.SshHost },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        
        var responseData = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        
        Assert.Equal(nameof(DatabaseOperationError.DatabaseNotFound), responseData.Detail);
    }
}