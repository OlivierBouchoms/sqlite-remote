namespace SqliteRemoteApi.Paths;

public class LocalPathTransformer : ILocalPathTransformer
{
    public string GetAbsolutePath(string path)
    {
        if (!path.StartsWith("~")) return path;
        
        return Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), path[1..]);
    }
}