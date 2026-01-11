using System.Net.Http.Json;
using Microsoft.AspNetCore.WebUtilities;
using SqliteRemoteApi.Dto;
using SqliteRemoteAPI.Tests.Config.Constants;
using SqliteRemoteAPI.Tests.Config.Data;
using SqliteRemoteAPI.Tests.Config.Verify;

namespace SqliteRemoteAPI.Tests.Controllers;

public partial class ServerControllerTests
{
    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task Snapshot_GET_Server_Connect(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerConnectRequestDto(new SshHostRequestDto(host), MockDatabase.Path);

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { "Host.HostName", requestDto.Host.HostName },
            { nameof(ServerConnectRequestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        await Verify(await response.Content.ReadFromJsonAsync<ServerConnectResponseDto>(), SnapshotSettings.Default).UseParameters(host);
    }

    [ClassData(typeof(InlineMockServerClassData))]
    [Theory]
    public async Task Snapshot_GET_Server_Connect_InlineServer(InlineMockServer host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerConnectRequestDto(new SshHostRequestDto(host.HostName, host.User, host.Port, host.IdentityFilePath), MockDatabase.Path);

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { "Host.HostName", requestDto.Host.HostName },
            { "Host.User", requestDto.Host.User },
            { "Host.Port", requestDto.Host.Port.ToString() },
            { "Host.IdentityFilePath", requestDto.Host.IdentityFilePath },
            { nameof(ServerConnectRequestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        await Verify(await response.Content.ReadFromJsonAsync<ServerConnectResponseDto>(), SnapshotSettings.Default)
            .UseParameters(string.Join("_", host.HostName, host.User, host.Port));
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task Snapshot_POST_Server_Query_WhenValidSelectQueryWithResults(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path,
            "SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID LIMIT 3");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        await VerifyExtensions.VerifyAndFormat<ServerQueryResponseDto>(response, SnapshotSettings.Default, v => v.UseParameters(host));
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task Snapshot_POST_Server_Query_WhenValidSelectQueryWithNoResults(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "SELECT CategoryID FROM Categories WHERE 1 != 1");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        await VerifyExtensions.VerifyAndFormat<ServerQueryResponseDto>(response, SnapshotSettings.Default, v => v.UseParameters(host));
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task Snapshot_POST_Server_Query_WhenValidSelectQueriesWithResults(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "SELECT 1; SELECT 2; SELECT 3");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        await VerifyExtensions.VerifyAndFormat<ServerQueryResponseDto>(response, SnapshotSettings.Default, v => v.UseParameters(host));
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task Snapshot_POST_Server_Query_WhenValidUpdateQueryWithNoModifiedRows(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "UPDATE Categories SET Description = 'update' WHERE 1 != 1");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        await VerifyExtensions.VerifyAndFormat<ServerQueryResponseDto>(response, SnapshotSettings.Default, v => v.UseParameters(host));
    }

    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task Snapshot_POST_Server_Query_WhenValidDeleteQueryWithNoModifiedRows(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new ServerQueryRequestDto(new SshHostRequestDto(host), MockDatabase.Path, "DELETE FROM Categories WHERE 1 != 1");

        var response = await client.PostAsJsonAsync("/api/server/query", requestDto);

        response.EnsureSuccessStatusCode();

        await VerifyExtensions.VerifyAndFormat<ServerQueryResponseDto>(response, SnapshotSettings.Default, v => v.UseParameters(host));
    }
}