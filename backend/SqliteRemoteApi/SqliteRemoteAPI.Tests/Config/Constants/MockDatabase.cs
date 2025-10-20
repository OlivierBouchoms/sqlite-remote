namespace SqliteRemoteAPI.Tests.Config.Constants;

public static class MockDatabase
{
    public const string Path = "/db/sqlite.db";
    
    public static readonly IReadOnlyList<string> AllTables = new List<string>
    {
        "Categories",
        "CustomerCustomerDemo",
        "CustomerDemographics",
        "Customers",
        "EmployeeTerritories",
        "Employees",
        "Order Details",
        "Orders",
        "Products",
        "Regions",
        "Shippers",
        "Suppliers",
        "Territories",
        "sqlite_sequence"
    };
    
    public static readonly IReadOnlyList<string> TestableTables = new List<string>
    {
        // Categories and Employees are temporarily excluded due to their larger BLOB data which complicates snapshot testing
        // "Categories", excluded due to BLOB data
        "CustomerCustomerDemo",
        "CustomerDemographics",
        "Customers",
        "EmployeeTerritories",
        // "Employees", excluded due to BLOB data
        // "Order Details", excluded due to huge content
        "Orders",
        "Products",
        "Regions",
        "Shippers",
        "Suppliers",
        "Territories",
        "sqlite_sequence"
    };
}