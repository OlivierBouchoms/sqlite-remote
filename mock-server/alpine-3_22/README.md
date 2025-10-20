# Alpine Linux 3.22 mock server

## SSH config

Copy the generated SSH key to the Docker container. The password for the root account is `mock`.

```shell
ssh-copy-id -i ~/.ssh/id_remote_sqlite -p 4022 root@localhost
```

Add the following entry to your SSH config file (`~/.ssh/config`)

```
Host sqlite_alpine_3_22
    HostName 127.0.0.1
    User root
    Port 4022
    IdentityFile ~/.ssh/id_remote_sqlite
```

## App database configuration

- Label: Alpine Linux 3.22 mock server
- Hostname: sqlite_alpine_22_04
- Database path: /db/sqlite.db
