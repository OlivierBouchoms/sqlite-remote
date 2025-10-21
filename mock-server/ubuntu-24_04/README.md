# Ubuntu 24.04 mock server

## SSH config

Add the following entry to your SSH config file (`~/.ssh/config`)

```
Host sqlite_ubuntu_24_04
    HostName 127.0.0.1
    User root
    Port 4124
    IdentityFile ~/.ssh/id_sqlite_remote
    StrictHostKeyChecking no
```

## App database configuration

- Label: Ubuntu 24.04 mock server
- Hostname: sqlite_ubuntu_24_04
- Database path: /db/sqlite.db
