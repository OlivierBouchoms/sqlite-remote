using System.Text.Json.Serialization;

namespace SqliteRemoteApi.Models;

public record TableSchemaColumn(int ColumnId, string Name, TableSchemaColumnType Type, bool Required, object? DefaultValue, bool PrimaryKey);

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TableSchemaColumnType
{
    NULL,
    INT, // STRICT table
    INTEGER,
    REAL,
    TEXT,
    BLOB,
    ANY, // STRICT table
}

public static class TableSchemaColumnTypeParser
{
    public static TableSchemaColumnType Parse(string type)
    {
        return type switch
        {
            "NULL" => TableSchemaColumnType.NULL,
            "INT" => TableSchemaColumnType.INT,
            "INTEGER" => TableSchemaColumnType.INTEGER,
            "REAL" => TableSchemaColumnType.REAL,
            "TEXT" => TableSchemaColumnType.TEXT,
            "BLOB" => TableSchemaColumnType.BLOB,
            "ANY" => TableSchemaColumnType.ANY,
            _ => TableSchemaColumnType.NULL,
        };
    }
}