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
        var result = await databaseManager.Connect(new DatabaseConnectInput(dto.SshHost, dto.DbPath));

        if (result.Success)
        {
            return Ok(new ServerConnectResponseDto(DatabaseOperationSshHostDto.From(result.SshHost), result.DbPath!));
        }

        return Problem(result.Error?.ToString());
    }
}