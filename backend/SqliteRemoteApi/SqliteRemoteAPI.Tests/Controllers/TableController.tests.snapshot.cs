using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Unicode;
using Microsoft.AspNetCore.WebUtilities;
using SqliteRemoteApi.Dto;
using SqliteRemoteAPI.Tests.Config.Data;
using SqliteRemoteAPI.Tests.Config.Verify;

namespace SqliteRemoteAPI.Tests.Controllers;

public partial class TableControllerTests
{
    [ClassData(typeof(MockServerClassData))]
    [Theory]
    public async Task Snapshot_GET_Table_Index(string host)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableIndexRequestDto(host, "/db/sqlite.db");
        
        var queryString = QueryHelpers.AddQueryString("/api/table", new Dictionary<string, string>
        {
            { nameof(requestDto.SshHost), requestDto.SshHost },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        await Verify(await response.Content.ReadFromJsonAsync<TableIndexResponseDto>(), SnapshotSettings.Default).UseParameters(host);
    }

    [ClassData(typeof(MockServerAndTableClassData))]
    [Theory]
    public async Task Snapshot_GET_Table_Data(string host, string tableName)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableDataRequestDto(host, "/db/sqlite.db");
        
        var queryString = QueryHelpers.AddQueryString($"/api/table/{tableName}/data", new Dictionary<string, string>
        {
            { nameof(requestDto.SshHost), requestDto.SshHost },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        response.EnsureSuccessStatusCode();

        await VerifyJson(await response.Content.ReadAsStringAsync(), SnapshotSettings.Default).UseParameters(host, tableName.Replace(" ", "_"));
    }

    [ClassData(typeof(MockServerAndTableClassData))]
    [Theory]
    public async Task Snapshot_GET_Table_Schema(string host, string tableName)
    {
        var client = _factory.CreateClient();
        var requestDto = new TableDataRequestDto(host, "/db/sqlite.db");
        
        var queryString = QueryHelpers.AddQueryString($"/api/table/{tableName}/schema", new Dictionary<string, string>
        {
            { nameof(requestDto.SshHost), requestDto.SshHost },
            { nameof(requestDto.DbPath), requestDto.DbPath }
        });

        var response = await client.GetAsync(queryString);

        response.EnsureSuccessStatusCode();

        await Verify(await response.Content.ReadFromJsonAsync<TableSchemaResponseDto>(), SnapshotSettings.Default).UseParameters(host, tableName.Replace(" ", "_"));
    }
}