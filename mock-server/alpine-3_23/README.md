# Alpine Linux 3.23 mock server

## SSH config

Add the following entry to your SSH config file (`~/.ssh/config`)

```
Host sqlite_alpine_3_23
    HostName 127.0.0.1
    User root
    Port 4023
    IdentityFile ~/.ssh/id_sqlite_remote
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
    IdentitiesOnly=yes
```

## App database configuration

- Label: Alpine Linux 3.23 mock server
- Hostname: sqlite_alpine_3_23
- Database path: /db/sqlite.db
