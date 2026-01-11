using System.Collections;
using SqliteRemoteAPI.Tests.Config.Constants;

namespace SqliteRemoteAPI.Tests.Config.Data;

public class InlineMockServerClassData : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator() => InlineMockServers.All
        .Select(t => new [] { t })
        .GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}