# Ubuntu 22.04 mock server

## SSH config

Copy the generated SSH key to the Docker container. The password for the root account is `mock`.

```shell
ssh-copy-id -i ~/.ssh/id_remote_sqlite -p 4122 root@localhost
```

Add the following entry to your SSH config file (`~/.ssh/config`)

```
Host sqlite_ubuntu_22_04
    HostName 127.0.0.1
    User root
    Port 4122
    IdentityFile ~/.ssh/id_remote_sqlite
```

## App database configuration

- Label: Ubuntu 22.04 mock server
- Hostname: sqlite_ubuntu_22_04
- Database path: /db/sqlite.db
