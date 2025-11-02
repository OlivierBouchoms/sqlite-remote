// ReSharper disable InconsistentNaming
namespace SqliteRemoteAPI.Tests.Config.Constants;

public static class MockServers
{
    private const string Alpine3_22 = "sqlite_alpine_3_22";
    private const string Ubuntu22_04 = "sqlite_ubuntu_22_04";
    private const string Ubuntu24_04 = "sqlite_ubuntu_24_04";

    public static readonly IReadOnlyCollection<string> All = [Alpine3_22, Ubuntu22_04, Ubuntu24_04];
}
