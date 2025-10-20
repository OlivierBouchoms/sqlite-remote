using System.Collections;
using SqliteRemoteAPI.Tests.Config.Constants;

namespace SqliteRemoteAPI.Tests.Config.Data;

public class MockServerClassData : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator() => MockServers.All
        .Select(t => new [] { t })
        .GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}