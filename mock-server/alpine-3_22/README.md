# Alpine Linux 3.22 mock server

## SSH config

Add the following entry to your SSH config file (`~/.ssh/config`)

```
Host sqlite_alpine_3_22
    HostName 127.0.0.1
    User root
    Port 4022
    IdentityFile ~/.ssh/id_sqlite_remote
    StrictHostKeyChecking no
```

## App database configuration

- Label: Alpine Linux 3.22 mock server
- Hostname: sqlite_alpine_3_22
- Database path: /db/sqlite.db
