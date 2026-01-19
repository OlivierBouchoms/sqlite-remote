using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using SqliteRemoteApi.Dto;
using SqliteRemoteApi.Dto.Error;
using SqliteRemoteApi.Manager;
using SqliteRemoteApi.Models;

namespace SqliteRemoteApi.Controllers;

[ApiController]
[Route("api/table")]
public class TableController(IDatabaseManager databaseManager) : Controller
{
    [HttpGet("")]
    [ProducesResponseType(200, Type = typeof(TableIndexResponseDto))]
    [ProducesResponseType(500, Type = typeof(DatabaseErrorResponseDto))]
    public async Task<IActionResult> Index([FromQuery] SshHostRequestDto host, [FromQuery] TableIndexRequestDto dto)
    {
        var hostInput = new SshHostInput(host.HostName, host.User, host.Port, host.IdentityFilePath);
        var result = await databaseManager.ListTables(new ListTablesInput(hostInput, dto.DbPath));

        if (result.Success)
        {
            var tables = result.Tables
                .Select(t => new TableIndexTableDto(t.Name))
                .ToArray();

            return Ok(new TableIndexResponseDto(tables));
        }

        HttpContext.Items[nameof(DatabaseErrorResponseDto.SshHost)] = DatabaseOperationSshHostDto.FromOrDefault(result.SshHost);

        return Problem(result.Error?.ToString());
    }

    [HttpGet("{name}/data")]
    [ProducesResponseType(200, Type = typeof(TableDataResponseDto))]
    [ProducesResponseType(500, Type = typeof(DatabaseErrorResponseDto))]
    public async Task<IActionResult> GetData([FromRoute] string name, [FromQuery] SshHostRequestDto host, [FromQuery] TableDataRequestDto dto)
    {
        var hostInput = new SshHostInput(host.HostName, host.User, host.Port, host.IdentityFilePath);
        var result = await databaseManager.GetTableData(new GetTableDataInput(name, hostInput, dto.DbPath));

        if (result.Success)
        {
            return Ok(new TableDataResponseDto(result.Data));
        }

        HttpContext.Items[nameof(DatabaseErrorResponseDto.SshHost)] = DatabaseOperationSshHostDto.FromOrDefault(result.SshHost);

        return Problem(result.Error?.ToString());
    }

    [HttpGet("{name}/schema")]
    [ProducesResponseType(200, Type = typeof(TableSchemaResponseDto))]
    [ProducesResponseType(500, Type = typeof(DatabaseErrorResponseDto))]
    public async Task<IActionResult> GetSchema([FromRoute] string name, [FromQuery] [Required] SshHostRequestDto host,
        [FromQuery] [Required] TableDataRequestDto dto)
    {
        var hostInput = new SshHostInput(host.HostName, host.User, host.Port, host.IdentityFilePath);
        var result = await databaseManager.GetTableSchema(new GetTableSchemaInput(name, hostInput, dto.DbPath));

        if (result.Success)
        {
            var columns = result.Columns
                .Select(c => new TableSchemaColumnDto(c.ColumnId, c.Name, c.Type, c.Required, c.DefaultValue, c.PrimaryKey))
                .ToArray();

            return Ok(new TableSchemaResponseDto(columns));
        }

        HttpContext.Items[nameof(DatabaseErrorResponseDto.SshHost)] = DatabaseOperationSshHostDto.FromOrDefault(result.SshHost);

        return Problem(result.Error?.ToString());
    }
}