using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.Options;
using Renci.SshNet;
using SqliteRemoteApi.Factory;
using SqliteRemoteApi.Models;
using SqliteRemoteApi.Models.Base;
using SqliteRemoteApi.Options;
using SqliteRemoteApi.Parser;
using SqliteRemoteApi.Paths;
using SshNet.Agent;

namespace SqliteRemoteApi.Manager;

public class SqLiteDatabaseManager(
    ISshConfigParser sshConfigParser,
    ISshClientFactory sshClientFactory,
    ILocalPathTransformer localPathTransformer,
    IRemotePathTransformer remotePathTransformer,
    IOptions<SshOptions> sshOptions,
    ILogger<SqLiteDatabaseManager> logger) : IDatabaseManager
{
    /// <summary>
    /// Timeout for connecting to the remote host
    /// </summary>
    private static readonly TimeSpan ConnectTimeout = TimeSpan.FromSeconds(10);

    /// <summary>
    /// Timeout for all regular commands, not performed on a database
    /// </summary>
    private static readonly TimeSpan CommandTimeout = TimeSpan.FromSeconds(10);

    /// <summary>
    /// Timeout for all commands that are performed on a database
    /// </summary>
    private static readonly TimeSpan DataCommandTimeout = TimeSpan.FromSeconds(30);

    public async Task<DatabaseConnectResult> Connect(DatabaseConnectInput input)
    {
        var connectionResult = await Connect(input.Host, input.DbPath);

        if (!connectionResult.Success)
            return new DatabaseConnectResult(false, connectionResult.SshHost, connectionResult.DbPath, connectionResult.Error);

        var command = connectionResult.Client!.CreateCommand("sqlite3 -json -version");

        try
        {
            var cts = new CancellationTokenSource(CommandTimeout);

            await command.ExecuteAsync(cts.Token);

            var success = command.ExitStatus == 0;

            return new DatabaseConnectResult(success, connectionResult.SshHost, connectionResult.DbPath,
                success ? null : DatabaseOperationError.DatabaseCommandFailed);
        }
        catch (OperationCanceledException e)
        {
            logger.LogWarning(e, "Check if sqlite3 binary exists on {SshHost} timed out", input.Host.HostName);
            return new(false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.RemoteCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Check if sqlite3 binary exists on {SshHost} failed", input.Host.HostName);
            return new(false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.RemoteCommandFailed);
        }
        finally
        {
            connectionResult.Client!.Dispose();
        }
    }

    public async Task<DatabaseQueryResult> Query(DatabaseQueryInput input)
    {
        var connectionResult = await Connect(input.Host, input.DbPath);

        if (!connectionResult.Success)
            return new DatabaseQueryResult([], false, connectionResult.SshHost, connectionResult.DbPath, connectionResult.Error);

        try
        {
            var cts = new CancellationTokenSource(DataCommandTimeout);

            var commandText = SanitizeCommandText(input.CommandText);

            var command = connectionResult.Client!.CreateCommand($"sqlite3 -json {connectionResult.DbPath} \"{commandText}\"");

            await command.ExecuteAsync(cts.Token);

            var success = command.ExitStatus == 0;
            var resultSets = await ParseSqliteCommandOutput(command);

            var errorContext = ParseSqliteCommandError(command);

            return new(resultSets, success, connectionResult.SshHost, connectionResult.DbPath,
                success ? null : DatabaseOperationError.DatabaseCommandFailed, errorContext);
        }
        catch (OperationCanceledException e)
        {
            logger.LogWarning(e, "Executing command for {DbPath} ({AbsolutePath}) on {SshHost} timed out. Command text:\n{CommandText}", input.DbPath,
                connectionResult.DbPath, input.Host.HostName, input.CommandText);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Executing command for {DbPath} ({AbsolutePath}) on {SshHost} failed. Command text:\n{CommandText}", input.DbPath,
                connectionResult.DbPath, input.Host.HostName, input.CommandText);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandFailed);
        }
        finally
        {
            connectionResult.Client!.Dispose();
        }
    }

    public async Task<ListTablesResult> ListTables(ListTablesInput input)
    {
        var connectionResult = await Connect(input.Host, input.DbPath);

        if (!connectionResult.Success)
            return new ListTablesResult([], false, connectionResult.SshHost, connectionResult.DbPath, connectionResult.Error);

        const string query = "SELECT Name FROM sqlite_master WHERE type ='table' ORDER BY Name";

        try
        {
            var cts = new CancellationTokenSource(DataCommandTimeout);

            var command = connectionResult.Client!.CreateCommand($"sqlite3 -json {connectionResult.DbPath} \"{query}\"");

            await command.ExecuteAsync(cts.Token);

            var success = command.ExitStatus == 0;
            var tables = success
                ? JsonSerializer.Deserialize<DatabaseTable[]>(command.Result, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })
                : null;

            return new(tables ?? [], success, connectionResult.SshHost, connectionResult.DbPath,
                success ? null : DatabaseOperationError.DatabaseCommandFailed);
        }
        catch (OperationCanceledException e)
        {
            logger.LogWarning(e, "Fetching tables for {DbPath} ({AbsolutePath}) on {SshHost} timed out", input.DbPath, connectionResult.DbPath,
                input.Host.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Fetching tables for {DbPath} ({AbsolutePath}) on {SshHost} failed", input.DbPath, connectionResult.DbPath,
                input.Host.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandFailed);
        }
        finally
        {
            connectionResult.Client!.Dispose();
        }
    }

    public async Task<GetTableDataResult> GetTableData(GetTableDataInput input)
    {
        var connectionResult = await Connect(input.Host, input.DbPath);

        if (!connectionResult.Success)
            return new GetTableDataResult([], false, connectionResult.SshHost, connectionResult.DbPath, connectionResult.Error);

        var query = $"SELECT * FROM '{input.Table}'";
        var commandText = string.Format($"sqlite3 -json '{connectionResult.DbPath}' \"{query}\"");
        var command = connectionResult.Client!.CreateCommand(commandText);

        try
        {
            var cts = new CancellationTokenSource(DataCommandTimeout);

            await command.ExecuteAsync(cts.Token);

            var success = command.ExitStatus == 0;
            var data = success && !string.IsNullOrEmpty(command.Result) ? JsonNode.Parse(command.Result)?.AsArray() ?? [] : [];

            return new(data, success, connectionResult.SshHost, connectionResult.DbPath,
                success ? null : DatabaseOperationError.DatabaseCommandFailed);
        }
        catch (OperationCanceledException e)
        {
            logger.LogWarning(e, "Fetching data for {DbPath} ({AbsolutePath}) on {SshHost} timed out", input.DbPath, connectionResult.DbPath,
                input.Host.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Fetching data for {DbPath} ({AbsolutePath}) on {SshHost} failed", input.DbPath, connectionResult.DbPath,
                input.Host.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandFailed);
        }
        finally
        {
            connectionResult.Client!.Dispose();
        }
    }

    public async Task<GetTableSchemaResult> GetTableSchema(GetTableSchemaInput input)
    {
        var connectionResult = await Connect(input.Host, input.DbPath);

        if (!connectionResult.Success)
            return new GetTableSchemaResult([], false, connectionResult.SshHost, connectionResult.DbPath, connectionResult.Error);

        var query = $"PRAGMA table_info('{input.Table}')";
        var command = connectionResult.Client!.CreateCommand($"sqlite3 -json '{connectionResult.DbPath}' \"{query}\"");

        try
        {
            var cts = new CancellationTokenSource(DataCommandTimeout);

            await command.ExecuteAsync(cts.Token);

            var success = command.ExitStatus == 0;

            var rawData = success && !string.IsNullOrEmpty(command.Result) ? JsonNode.Parse(command.Result)?.AsArray() ?? [] : [];
            var items = new List<TableSchemaColumn>(rawData.Count);

            foreach (var row in rawData)
            {
                if (row == null) continue;

                items.Add(new TableSchemaColumn(
                    row["cid"]!.GetValue<int>(),
                    row["name"]!.GetValue<string>(),
                    TableSchemaColumnTypeParser.Parse(row["type"]!.GetValue<string>()),
                    row["notnull"]!.GetValue<int>() == 1,
                    row["dflt_value"],
                    row["pk"]!.GetValue<int>() == 1
                ));
            }

            return new GetTableSchemaResult(items, success, connectionResult.SshHost, connectionResult.DbPath,
                success ? null : DatabaseOperationError.DatabaseCommandFailed);
        }
        catch (OperationCanceledException e)
        {
            logger.LogWarning(e, "Fetching schema for {DbPath} ({AbsolutePath}) on {SshHost} timed out", input.DbPath, connectionResult.DbPath,
                input.Host.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Fetching schema for {DbPath} ({AbsolutePath}) on {SshHost} failed", input.DbPath, connectionResult.DbPath,
                input.Host.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandFailed);
        }
        finally
        {
            connectionResult.Client.Dispose();
        }
    }

    /// <summary>
    /// Attempts to connect to the SSH host and verifies if the database file exists
    /// </summary>
    async Task<DatabaseServerConnectResult> Connect(SshHostInput input, string dbPath)
    {
        SshHost? sshHost;

        try
        {
            var sshConfig = await sshConfigParser.Parse(sshOptions.Value.ConfigPath);
            sshHost = sshConfig.Hosts.FirstOrDefault(h => h.Name == input.HostName);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "SSH config parsing failed");
            return new DatabaseServerConnectResult(null, null, false, null, DatabaseOperationError.SshConfigInvalid);
        }

        if (sshHost is null)
        {
            // use inline host definition from user input
            sshHost = new SshHost
            {
                Name = input.HostName,
                HostName = input.HostName,
                Port = input.Port ?? 22,
                User = input.User ?? Environment.UserName,
                Origin = SshHostOrigin.Inline,
                IdentityFile = !string.IsNullOrEmpty(input.IdentityFilePath) ? localPathTransformer.GetAbsolutePath(input.IdentityFilePath) : null
            };
        }
        else
        {
            // if provided, overwrite port and user
            if (input.Port is not null) sshHost.Port = input.Port.Value;
            if (input.User is not null) sshHost.User = input.User;
            if (input.IdentityFilePath is not null)
                sshHost.IdentityFile = !string.IsNullOrEmpty(input.IdentityFilePath) ? localPathTransformer.GetAbsolutePath(input.IdentityFilePath) : null;
        }

        var client = sshClientFactory.CreateSshClient(sshHost);

        try
        {
            var cts = new CancellationTokenSource(ConnectTimeout);

            await client.ConnectAsync(cts.Token);
        }
        catch (OperationCanceledException e)
        {
            logger.LogWarning(e, "Failed to connect to {SshHost}", sshHost.HostName);
            client.Dispose();
            return new DatabaseServerConnectResult(null, null, false, sshHost, DatabaseOperationError.ConnectTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Failed to connect to {SshHost}", sshHost.HostName);
            client.Dispose();
            return new DatabaseServerConnectResult(null, null, false, sshHost, DatabaseOperationError.ConnectFailed);
        }

        string? absolutePath = null;

        try
        {
            var pathTransformCts = new CancellationTokenSource(CommandTimeout);

            absolutePath = await remotePathTransformer.GetAbsolutePath(dbPath, client, pathTransformCts.Token);

            var fileExistsCommand = client.CreateCommand(string.Format("test -f '{0}'", absolutePath));

            var fileExistsCts = new CancellationTokenSource(CommandTimeout);

            await fileExistsCommand.ExecuteAsync(fileExistsCts.Token);

            var fileExists = fileExistsCommand.ExitStatus == 0;

            return new DatabaseServerConnectResult(client, absolutePath, fileExists, sshHost, fileExists ? null : DatabaseOperationError.DatabaseNotFound);
        }
        catch (OperationCanceledException e)
        {
            logger.LogWarning(e, "Check if {DbPath} ({AbsolutePath}) exists on {SshHost} timed out", dbPath, absolutePath, sshHost.HostName);
            client.Dispose();
            return new DatabaseServerConnectResult(null, null, false, sshHost, DatabaseOperationError.RemoteCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Check if {DbPath} ({AbsolutePath}) exists on {SshHost} failed", dbPath, absolutePath, sshHost.HostName);
            client.Dispose();
            return new DatabaseServerConnectResult(null, null, false, sshHost, DatabaseOperationError.RemoteCommandFailed);
        }
    }

    /// <summary>
    /// Parses result data for an SshCommand that executed one or multiple queries
    /// </summary>
    async Task<ICollection<JsonArray>> ParseSqliteCommandOutput(SshCommand command)
    {
        var data = new List<JsonArray>();

        if (command.ExitStatus != 0) return [];

        if (command.OutputStream.CanSeek)
            command.OutputStream.Position = 0;

        var jsonStringBuilder = new StringBuilder();

        using var reader = new StreamReader(command.OutputStream, leaveOpen: true);
        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();

            jsonStringBuilder.Append(line);

            if (!string.IsNullOrEmpty(line) && line.EndsWith(']')) // end of the JSON array
            {
                data.Add(JsonNode.Parse(jsonStringBuilder.ToString())?.AsArray() ?? []);

                jsonStringBuilder.Clear();
            }
        }

        if (data.Count == 0) data.Add([]);

        return data;
    }

    string ParseSqliteCommandError(SshCommand command)
    {
        if (command.ExitStatus == 0) return "";

        var error = command.Error.Trim();

        if (error.EndsWith("^--- error here"))
        {
            error = error.Remove(error.LastIndexOf("^--- error here", StringComparison.Ordinal), "^--- error here".Length);
        }

        return error.TrimEnd();
    }

    string SanitizeCommandText(string commandText)
    {
        return commandText
            .ReplaceLineEndings(" ")
            .Replace("\"", "\\\"")
            .Trim();
    }
}