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
    public async Task<IActionResult> Index([FromQuery] TableIndexRequestDto dto)
    {
        var result = await databaseManager.ListTables(new ListTablesInput(dto.SshHost, dto.DbPath));

        if (result.Success)
        {
            var tables = result.Tables
                .Select(t => new TableIndexTableDto(t.Name))
                .ToArray();
            
            return Ok(new TableIndexResponseDto(tables));
        }

        return Problem(result.Error?.ToString());
    }

    [HttpGet("{name}/data")]
    [ProducesResponseType(200, Type = typeof(TableDataResponseDto))]
    [ProducesResponseType(500, Type = typeof(DatabaseErrorResponseDto))]
    public async Task<IActionResult> GetData([FromRoute] string name, [FromQuery] TableDataRequestDto dto)
    {
        var result = await databaseManager.GetTableData(new GetTableDataInput(name, dto.SshHost, dto.DbPath));

        if (result.Success)
        {
            return Ok(new TableDataResponseDto(result.Data));
        }

        return Problem(result.Error?.ToString());
    }

    [HttpGet("{name}/schema")]
    [ProducesResponseType(200, Type = typeof(TableSchemaResponseDto))]
    [ProducesResponseType(500, Type = typeof(DatabaseErrorResponseDto))]
    public async Task<IActionResult> GetSchema([FromRoute] string name, [FromQuery] TableDataRequestDto dto)
    {
        var result = await databaseManager.GetTableSchema(new GetTableSchemaInput(name, dto.SshHost, dto.DbPath));

        if (result.Success)
        {
            var columns = result.Columns
                .Select(c => new TableSchemaColumnDto(c.ColumnId, c.Name, c.Type, c.Required, c.DefaultValue, c.PrimaryKey))
                .ToArray();
            
            return Ok(new TableSchemaResponseDto(columns));
        }

        return Problem(result.Error?.ToString());
    }
}