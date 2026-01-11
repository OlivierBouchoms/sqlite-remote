using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
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

public partial class TableControllerTests(ITestOutputHelper output)
{
    private readonly WebApplicationFactory<Program> _factory = new CiWebApplicationFactory<Program>(output);

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task GET_Table_Index_ShouldReturn200_WhenValidRequest(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableIndexRequestDto(MockDatabase.Path);
        var hostDto = new SshHostRequestDto(host);

        var queryString = QueryHelpers.AddQueryString("/api/table", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<TableIndexResponseDto>();

        var areTablesEqual = MockDatabase.AllTables.SequenceEqual(responseData.Tables.Select(t => t.Name));

        Assert.True(areTablesEqual);
    }

    [Fact]
    public async Task GET_Table_Index_ShouldReturn500_SshHostNotFound_WhenUnknownHostNotInConfig()
    {
        var client = _factory.CreateClient();
        var requestDto = new TableIndexRequestDto(MockDatabase.Path);
        var hostDto = new SshHostRequestDto("unknown-host");

        var queryString = QueryHelpers.AddQueryString("/api/table", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
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
    public async Task GET_Table_Index_ShouldReturn500_DatabaseNotFound_WhenInvalidPath(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableIndexRequestDto("/db/unknown.db");
        var hostDto = new SshHostRequestDto(host);

        var queryString = QueryHelpers.AddQueryString("/api/table", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.DatabaseNotFound, responseData.Detail);
        Assert.Equal(SshHostOrigin.SshConfig, responseData.SshHost.Origin);
    }

    [ClassData(typeof(MockServerAndTableClassData))]
    [Theory]
    public async Task GET_Table_Data_ShouldReturn200_WhenValidRequest(string host, string tableName)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableDataRequestDto(MockDatabase.Path);
        var hostDto = new SshHostRequestDto(host);

        var queryString = QueryHelpers.AddQueryString($"/api/table/{tableName}/data", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<TableDataResponseDto>();

        Assert.NotNull(responseData.Data);
    }

    [Fact]
    public async Task GET_Table_Data_ShouldReturn500_ConnectFailed_WhenUnknownHostNotInConfig()
    {
        var client = _factory.CreateClient();
        var requestDto = new TableDataRequestDto(MockDatabase.Path);
        var hostDto = new SshHostRequestDto("unknown-host");

        var queryString = QueryHelpers.AddQueryString($"/api/table/{MockDatabase.TestableTables[0]}/data", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
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
    public async Task GET_Table_Data_ShouldReturn500_DatabaseNotFound_WhenInvalidPath(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableDataRequestDto("/db/unknown.db");
        var hostDto = new SshHostRequestDto(host);
        
        var queryString = QueryHelpers.AddQueryString($"/api/table/{MockDatabase.TestableTables[0]}/data", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.DatabaseNotFound, responseData.Detail);
        Assert.Equal(SshHostOrigin.SshConfig, responseData.SshHost.Origin);
    }

    [ClassData(typeof(MockServerAndTableClassData))]
    [Theory]
    public async Task GET_Table_Schema_ShouldReturn200_WhenValidRequest(string host, string tableName)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableDataRequestDto("/db/sqlite.db");
        var hostDto = new SshHostRequestDto(host);

        var queryString = QueryHelpers.AddQueryString($"/api/table/{tableName}/schema", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<TableSchemaResponseDto>();

        Assert.NotEmpty(responseData.Columns);
    }

    [Fact]
    public async Task GET_Table_Schema_ShouldReturn500_ConnectFailed_WhenUnknownHostNotInConfig()
    {
        var client = _factory.CreateClient();
        var requestDto = new TableSchemaRequestDto(MockDatabase.Path);
        var hostDto = new SshHostRequestDto("unknown-host");
        
        var queryString = QueryHelpers.AddQueryString($"/api/table/{MockDatabase.TestableTables[0]}/schema", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
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
    public async Task GET_Table_Schema_ShouldReturn500_DatabaseNotFound_WhenInvalidPath(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableSchemaRequestDto("/db/unknown.db");
        var hostDto = new SshHostRequestDto(host);

        var queryString = QueryHelpers.AddQueryString($"/api/table/{MockDatabase.TestableTables[0]}/schema", new Dictionary<string, string>
        {
            { nameof(hostDto.HostName), hostDto.HostName },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);
        var responseData = await response.Content.ReadFromJsonAsync<DatabaseErrorResponseDto>();

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal(DatabaseOperationError.DatabaseNotFound, responseData.Detail);
        Assert.Equal(SshHostOrigin.SshConfig, responseData.SshHost.Origin);
    }
}