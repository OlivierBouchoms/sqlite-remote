# Ubuntu 22.04 mock server

## SSH config

Add the following entry to your SSH config file (`~/.ssh/config`)

```
Host sqlite_ubuntu_22_04
    HostName 127.0.0.1
    User root
    Port 4122
    IdentityFile ~/.ssh/id_sqlite_remote
    StrictHostKeyChecking no
```

## App database configuration

- Label: Ubuntu 22.04 mock server
- Hostname: sqlite_ubuntu_22_04
- Database path: /db/sqlite.db
