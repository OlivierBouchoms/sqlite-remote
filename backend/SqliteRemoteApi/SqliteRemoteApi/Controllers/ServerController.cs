using Microsoft.AspNetCore.Mvc;
using SqliteRemoteApi.Dto;
using SqliteRemoteApi.Dto.Error;
using SqliteRemoteApi.Manager;
using SqliteRemoteApi.Models;

namespace SqliteRemoteApi.Controllers;

[ApiController]
[Route("api/server")]
public class ServerController(IDatabaseManager databaseManager) : Controller
{
    [HttpGet("connection")]
    [ProducesResponseType(200, Type = typeof(ServerConnectResponseDto))]
    [ProducesResponseType(500, Type = typeof(DatabaseErrorResponseDto))]
    public async Task<IActionResult> Connect([FromQuery] ServerConnectRequestDto dto)
    {
        var host = new SshHostInput(dto.Host.HostName, dto.Host.User, dto.Host.Port, dto.Host.IdentityFilePath);
        var result = await databaseManager.Connect(new DatabaseConnectInput(host, dto.DbPath));

        if (result.Success)
        {
            return Ok(new ServerConnectResponseDto(DatabaseOperationSshHostDto.From(result.SshHost), result.DbPath!));
        }
        
        HttpContext.Items[nameof(DatabaseErrorResponseDto.SshHost)] = DatabaseOperationSshHostDto.FromOrDefault(result.SshHost);

        return Problem(result.Error?.ToString());
    }

    [HttpPost("query")]
    [ProducesResponseType(200, Type = typeof(ServerQueryResponseDto))]
    [ProducesResponseType(500, Type = typeof(DatabaseErrorResponseDto))]
    public async Task<IActionResult> Query([FromBody] ServerQueryRequestDto dto)
    {
        var host = new SshHostInput(dto.Host.HostName, dto.Host.User, dto.Host.Port);
        var result = await databaseManager.Query(new DatabaseQueryInput(host, dto.DbPath, dto.CommandText));
        
        if (result.Success)
        {
            return Ok(new ServerQueryResponseDto(result.ResultSets));
        }

        HttpContext.Items[nameof(DatabaseErrorResponseDto.DetailContext)] = result.ErrorContext;
        HttpContext.Items[nameof(DatabaseErrorResponseDto.SshHost)] = DatabaseOperationSshHostDto.FromOrDefault(result.SshHost);

        return Problem(result.Error?.ToString());
    }
}