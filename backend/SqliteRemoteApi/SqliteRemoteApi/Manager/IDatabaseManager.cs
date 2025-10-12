using SqliteRemoteApi.Models;

namespace SqliteRemoteApi.Manager;

public interface IDatabaseManager
{
    Task<DatabaseConnectResult> Connect(DatabaseConnectInput input);

    Task<ListTablesResult> ListTables(ListTablesInput input);

    Task<GetTableDataResult> GetTableData(GetTableDataInput input);
    
    Task<GetTableSchemaResult> GetTableSchema(GetTableSchemaInput input);
}