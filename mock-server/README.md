# Mock server

This Docker container contains an SSH agent and SQLite3 database. It allows for local testing, without requiring access to an external server with an SQLite database.

## Getting started

### Image

```shell
docker build . -t mock-sqlite-server
docker run -d -p 4022:22 --name mock-sqlite-server mock-sqlite-server 
```

### SSH config

Generate an SSH key and copy it to the Docker container.

The password for the root account is `mock`.

```shell
ssh-keygen -f ~/.ssh/id_remote_sqlite
ssh-copy-id -i ~/.ssh/id_remote_sqlite -p 4022 root@localhost
```

Add the following entry to your SSH config file (`~/.ssh/config`)

```
Host mock_sqlite_server
    HostName 127.0.0.1
    User root
    Port 4022
    IdentityFile ~/.ssh/id_remote_sqlite
```

### App database configuration

- Label: Docker mock server
- Hostname: mock_sqlite_server
- Database path: /db/sqlite.db

## Mock database

The Microsoft Access 2000 Northwind sample database for SQLite3 is used as sample database.

Source: https://github.com/jpwhite3/northwind-SQLite3
