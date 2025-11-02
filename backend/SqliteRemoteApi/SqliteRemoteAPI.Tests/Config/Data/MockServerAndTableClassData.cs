using System.Collections;
using SqliteRemoteAPI.Tests.Config.Constants;

namespace SqliteRemoteAPI.Tests.Config.Data;

public class MockServerAndTableClassData : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator() => 
        MockServers.All
            .SelectMany(server => MockDatabase.TestableTables.Select(table => new object[] { server, table }))
            .GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}