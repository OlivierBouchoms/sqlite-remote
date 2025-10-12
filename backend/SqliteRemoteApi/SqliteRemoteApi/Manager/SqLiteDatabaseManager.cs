using System.Text.Json;
using System.Text.Json.Nodes;
using Renci.SshNet;
using SqliteRemoteApi.Models;
using SqliteRemoteApi.Models.Base;
using SqliteRemoteApi.Parser;
using SqliteRemoteApi.Paths;

namespace SqliteRemoteApi.Manager;

public class SqLiteDatabaseManager(ISshConfigParser sshConfigParser, IPathTransformer pathTransformer, ILogger<SqLiteDatabaseManager> logger) : IDatabaseManager
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
        var connectionResult = await Connect(input.HostName, input.DbPath);

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
            logger.LogWarning(e, "Check if sqlite3 binary exists on {SshHost} timed out", input.HostName);
            return new(false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.RemoteCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Check if sqlite3 binary exists on {SshHost} failed", input.HostName);
            return new(false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.RemoteCommandFailed);
        }
        finally
        {
            connectionResult.Client!.Dispose();
        }
    }

    public async Task<ListTablesResult> ListTables(ListTablesInput input)
    {
        var connectionResult = await Connect(input.HostName, input.DbPath);

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
            logger.LogWarning(e, "Fetching tables for {DbPath} ({AbsolutePath}) on {SshHost} timed out", input.DbPath, connectionResult.DbPath, input.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Fetching tables for {DbPath} ({AbsolutePath}) on {SshHost} failed", input.DbPath, connectionResult.DbPath, input.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandFailed);
        }
        finally
        {
            connectionResult.Client!.Dispose();
        }
    }

    public async Task<GetTableDataResult> GetTableData(GetTableDataInput input)
    {
        var connectionResult = await Connect(input.HostName, input.DbPath);

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
            logger.LogWarning(e, "Fetching data for {DbPath} ({AbsolutePath}) on {SshHost} timed out", input.DbPath, connectionResult.DbPath, input.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Fetching data for {DbPath} ({AbsolutePath}) on {SshHost} failed", input.DbPath, connectionResult.DbPath, input.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandFailed);
        }
        finally
        {
            connectionResult.Client!.Dispose();
        }
    }

    public async Task<GetTableSchemaResult> GetTableSchema(GetTableSchemaInput input)
    {
        var connectionResult = await Connect(input.HostName, input.DbPath);

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
            logger.LogWarning(e, "Fetching schema for {DbPath} ({AbsolutePath}) on {SshHost} timed out", input.DbPath, connectionResult.DbPath, input.HostName);
            return new([], false, connectionResult.SshHost, connectionResult.DbPath, DatabaseOperationError.DatabaseCommandTimeOut);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Fetching schema for {DbPath} ({AbsolutePath}) on {SshHost} failed", input.DbPath, connectionResult.DbPath, input.HostName);
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
    async Task<DatabaseServerConnectResult> Connect(string hostName, string dbPath)
    {
        SshHost? sshHost;

        try
        {
            var sshConfig = await sshConfigParser.Parse("~/.ssh/config");
            sshHost = sshConfig.Hosts.FirstOrDefault(h => h.Name == hostName);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "SSH config parsing failed");
            return new DatabaseServerConnectResult(null, null, false, null, DatabaseOperationError.SshConfigInvalid);
        }

        if (sshHost is null)
            return new DatabaseServerConnectResult(null, null, false, null, DatabaseOperationError.SshHostNotFound);

        var client = new SshClient(new PrivateKeyConnectionInfo(sshHost.HostName, sshHost.Port, sshHost.User,
            new PrivateKeyFile(sshHost.IdentityFile)));

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
            
            absolutePath = await pathTransformer.Transform(dbPath, client, pathTransformCts.Token);
            
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
}