# Ubuntu 26.04 mock server

## SSH config

Add the following entry to your SSH config file (`~/.ssh/config`)

```
Host sqlite_ubuntu_26_04
    HostName 127.0.0.1
    User root
    Port 4126
    IdentityFile ~/.ssh/id_sqlite_remote
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
    IdentitiesOnly=yes
```

## App database configuration

- Label: Ubuntu 26.04 mock server
- Hostname: sqlite_ubuntu_26_04
- Database path: /db/sqlite.db
