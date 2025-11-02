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
        var requestDto = new ServerConnectRequestDto(host, MockDatabase.Path);

        var queryString = QueryHelpers.AddQueryString("/api/server/connection", new Dictionary<string, string>
        {
            { nameof(ServerConnectRequestDto.SshHost), requestDto.SshHost },
            { nameof(ServerConnectRequestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        await Verify(await response.Content.ReadFromJsonAsync<ServerConnectResponseDto>(), SnapshotSettings.Default).UseParameters(host);
    }
}