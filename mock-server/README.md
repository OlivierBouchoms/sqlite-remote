# Mock server

These Docker containers contain an SSH agent and SQLite3 database. It allows for local testing, without requiring access to an external server with an SQLite database.

## Containers

| OS           | Version | SQLite version | SSH Port | README                                             |
|--------------|---------|----------------|----------|----------------------------------------------------|
| Alpine Linux | 3.22    | 3.49.2         | 4022     | [alpine-3_22/README.md](./alpine-3_22/README.md)   |
| Alpine Linux | 3.23    | 3.51.1         | 4023     | [alpine-3_23/README.md](./alpine-3_23/README.md)   |
| Ubuntu       | 22.04   | 3.37.2         | 4122     | [ubuntu-22_04/README.md](./ubuntu-22_04/README.md) |
| Ubuntu       | 24.04   | 3.45.1         | 4124     | [ubuntu-24_04/README.md](./ubuntu-24_04/README.md) |
| Ubuntu       | 26.04   | 3.46.1         | 4126     | [ubuntu-26_04/README.md](./ubuntu-26_04/README.md) |

## Getting started

### Generate SSH key

Generate an SSH key to authenticate with the mock server containers. The public key is automatically mounted in the Docker Compose containers.

```shell
ssh-keygen -f ~/.ssh/id_sqlite_remote -t ed25519 -N ""
```

### Run containers

```shell
docker compose up -d
```

## Build containers

As the containers are built for multiple architectures, Docker buildx is used.

I personally use a remote build host (a Raspberry Pi 4) to build the ARM64 images, while the AMD64 images are built on my dev machine.

### Setup

This script creates a new Buildx builder instance with two nodes, one for ARM64 and one for AMD64.

```shell
# first add the arm64 remote build host, otherwise the local machine (x86) will build arm64 images as well
docker buildx create --name sqlite-remote-ci --driver docker-container --platform linux/arm64 ssh://<user>@<host> --use
docker buildx create --name sqlite-remote-ci --driver docker-container --platform linux/amd64 --append
docker buildx inspect --bootstrap
```

### Build and push

```shell
docker buildx use sqlite-remote-ci
docker buildx bake ${service_name} --push
```

## Adding a new container

1. Add a new template to the [ci/scripts/generate-ssh-config/templates.ts](/ci/scripts/generate-ssh-config/templates.ts) file. The port to use is determined by the OS family (see below) and the version number.
2. Add a new template to the [docs/scripts/generate-mock-server/templates.ts](/docs/scripts/generate-mock-server/templates.ts) file. Use the same port and values as in the previous step.
3. Generate the documentation.

```shell
cd docs/scripts
npm run gen:mock-server
```

4. Add a Dockerfile and `entrypoint.sh` script to the generated directory (`mock-server/{os_name}`).
5. Add the new container to the [docker-compose.yml](/docker-compose.yml) file.
6. Add the new container to the [MockServers.cs](/backend/SqliteRemoteApi/SqliteRemoteAPI.Tests/Config/Constants/MockServers.cs) file in the backend test project.
7. Generate the new SSH hosts.

```shell
cd ci/scripts
npm run gen:ssh-config
```

8. Open the generated SSH config file [config.gen](/ci/scripts/generate-ssh-config/config.gen) and add the new entry to your SSH config file.

### Port ranges

| OS             | Range     |
|----------------|-----------|
| Alpine Linux 3 | 4000-4999 |
| Ubuntu         | 4100-4999 |

## Mock database

The Microsoft Access 2000 Northwind sample database for SQLite3 is used as sample database.

Source: https://github.com/jpwhite3/northwind-SQLite3
