namespace SqliteRemoteAPI.Tests.Config.Verify;

public static class SnapshotSettings
{
    private static VerifySettings _default;

    public static VerifySettings Default
    {
        get
        {
            if (_default == null)
            {
                _default = new VerifySettings();
                _default.UseDirectory("Snapshots");
            }

            return _default;
        }
    }
}
