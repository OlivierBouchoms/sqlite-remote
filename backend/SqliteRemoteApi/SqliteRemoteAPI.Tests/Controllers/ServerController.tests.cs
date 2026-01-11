using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.WebUtilities;
using SqliteRemoteApi.Dto;
using SqliteRemoteApi.Dto.Error;
using SqliteRemoteApi.Models;
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
        var requestDto = new ServerConnectRequestDto(new SshHostRequestDto(host), MockDatabase.Path);

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { "Host.HostName", requestDto.Host.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerConnectResponseDto>();

        Assert.Equal(requestDto.DbPath, responseData.DbPath);
        Assert.Equal(SshHostOrigin.SshConfig, responseData.SshHost.Origin);
    }
    
    [ClassData(typeof(InlineMockServerClassData))]
    [Theory]
    public async Task GET_Server_Connect_ShouldReturn200_WhenValidRequest_ForInlineMockServer(InlineMockServer host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerConnectRequestDto(new SshHostRequestDto(host.HostName, host.User, host.Port, host.IdentityFilePath), MockDatabase.Path);

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { "Host.HostName", requestDto.Host.HostName },
            { "Host.User", requestDto.Host.User },
            { "Host.Port", requestDto.Host.Port.ToString() },
            { "Host.IdentityFilePath", requestDto.Host.IdentityFilePath },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerConnectResponseDto>();

        Assert.Equal(requestDto.DbPath, responseData.DbPath);
        Assert.Equal(SshHostOrigin.Inline, responseData.SshHost.Origin);
    }

    [Fact]
    public async Task GET_Server_Connect_ShouldReturn500_ConnectFailed_WhenUnknownHostNotInConfig()
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerConnectRequestDto(new SshHostRequestDto("unknown-host"), MockDatabase.Path);

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { "Host.HostName", requestDto.Host.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.ConnectFailed, responseData.Detail);
        Assert.Equal(SshHostOrigin.Inline, responseData.SshHost.Origin);
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task GET_Server_Connect_ShouldReturn500_DatabaseNotFound_WhenInvalidPath(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerConnectRequestDto(new SshHostRequestDto(host), "/db/unknown.db");

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { "Host.HostName", requestDto.Host.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);
        
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.DatabaseNotFound, responseData.Detail);
        Assert.Equal(SshHostOrigin.SshConfig, responseData.SshHost.Origin);
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task POST_Server_Query_ShouldReturn200_WhenValidSelectQueryWithResults(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path,
            "SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID LIMIT 3");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerQueryResponseDto>();

        Assert.NotNull(responseData);
        Assert.Single(responseData.ResultSets);
        Assert.NotEmpty(responseData.ResultSets.First());
    }
    
    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task POST_Server_Query_ShouldReturn200_WhenValidMultiLineSelectQueryWithResults(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path,
            @"
SELECT
    c.CustomerID,
    c.CompanyName,
    (
        SELECT COUNT(*)
        FROM Orders o
        WHERE o.CustomerID = c.CustomerID
          AND EXISTS (
              SELECT 1
              FROM ""Order Details"" od
              WHERE od.OrderID = o.OrderID
                AND od.UnitPrice > (
                    SELECT AVG(UnitPrice)
                    FROM ""Order Details""
                )
          )
    ) AS ExpensiveOrderCount
FROM Customers c
WHERE c.CompanyName LIKE '%a%'
ORDER BY (
    SELECT SUM(od.Quantity * od.UnitPrice)
    FROM Orders o2
    JOIN ""Order Details"" od ON od.OrderID = o2.OrderID
    WHERE o2.CustomerID = c.CustomerID
);
");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerQueryResponseDto>();

        Assert.NotNull(responseData);
        Assert.Single(responseData.ResultSets);
        Assert.NotEmpty(responseData.ResultSets.First());
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    [SuppressMessage("Assertions", "xUnit2013:Do not use equality check to check for collection size.")] // need to check Count property, as Assert.Empty evaluates to false on JsonArray
    public async Task POST_Server_Query_ShouldReturn200_WhenValidSelectQueryWithNoResults(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "SELECT CategoryID FROM Categories WHERE 1 != 1");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerQueryResponseDto>();

        Assert.NotNull(responseData);
        Assert.Single(responseData.ResultSets);
        Assert.Equal(0, responseData.ResultSets.First().Count);
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task POST_Server_Query_ShouldReturn200_WhenValidSelectQueriesWithResults(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "SELECT 1; SELECT 2; SELECT 3");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerQueryResponseDto>();

        Assert.NotNull(responseData);
        Assert.NotEmpty(responseData.ResultSets);
        Assert.Equal(3, responseData.ResultSets.Count);
        
        Assert.All(responseData.ResultSets, rs => Assert.Single(rs));
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    [SuppressMessage("Assertions", "xUnit2013:Do not use equality check to check for collection size.")] // need to check Count property, as Assert.Empty evaluates to false on JsonArray
    public async Task POST_Server_Query_ShouldReturn200_WhenValidUpdateQueryWithNoModifiedRows(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "UPDATE Categories SET Description = 'update' WHERE 1 != 1");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerQueryResponseDto>();

        Assert.NotNull(responseData);
        Assert.NotEmpty(responseData.ResultSets);
        Assert.Single(responseData.ResultSets);
        Assert.Equal(0, responseData.ResultSets.First().Count);
    }
    
    [ClassData(typeof(MockServerClassData))]
    [Theory]
    [SuppressMessage("Assertions", "xUnit2013:Do not use equality check to check for collection size.")] // need to check Count property, as Assert.Empty evaluates to false on JsonArray
    public async Task POST_Server_Query_ShouldReturn200_WhenValidDeleteQueryWithNoModifiedRows(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "DELETE FROM Categories WHERE 1 != 1");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<ServerQueryResponseDto>();

        Assert.NotNull(responseData);
        Assert.NotEmpty(responseData.ResultSets);
        Assert.Single(responseData.ResultSets);
        Assert.Equal(0, responseData.ResultSets.First().Count);
    }
    
    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task POST_Server_Query_ShouldReturn500_DatabaseCommandFailed_WhenInvalidTable(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "SELECT * FROM __unknown_table__");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.DatabaseCommandFailed, responseData.Detail);
        Assert.StartsWith("Error: in prepare, no such table: __unknown_table__", responseData.DetailContext);
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task POST_Server_Query_ShouldReturn500_DatabaseCommandFailed_WhenInvalidColumn(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "SELECT __unknown_column__ FROM Categories");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.DatabaseCommandFailed, responseData.Detail);
        Assert.StartsWith("Error: in prepare, no such column: __unknown_column__", responseData.DetailContext);
    }
    
    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task POST_Server_Query_ShouldReturn500_DatabaseCommandFailed_WhenInvalidSyntax(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "SEL__ECT CategoryId FROM Categories");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.DatabaseCommandFailed, responseData.Detail);
        Assert.StartsWith("Error: in prepare, near \"SEL__ECT\": syntax error", responseData.DetailContext);
    }
    
    [Fact]
    public async Task POST_Server_Query_ShouldReturn500_ConnectFailed_WhenUnknownHostNotInConfig()
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto("unknown-host"), MockDatabase.Path, "DELETE FROM Categories WHERE 1 != 1");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.ConnectFailed, responseData.Detail);
        Assert.Equal(SshHostOrigin.Inline, responseData.SshHost.Origin);
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task POST_Server_Query_ShouldReturn500_DatabaseNotFound_WhenInvalidPath(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), "/db/unknown.db", "DELETE FROM Categories WHERE 1 != 1");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.DatabaseNotFound, responseData.Detail);
        Assert.Equal(SshHostOrigin.SshConfig, responseData.SshHost.Origin);
    }
}
