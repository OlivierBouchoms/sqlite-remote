# Mock server

These Docker containers contain an SSH agent and SQLite3 database. It allows for local testing, without requiring access to an external server with an SQLite database.

## Containers

| OS           | Version | SSH Port | README                                             |
|--------------|---------|----------|----------------------------------------------------|
| Alpine Linux | 3.22    | 4022     | [alpine-3_22/README.md](./alpine-3_22/README.md)   |
| Ubuntu       | 22.04   | 4122     | [ubuntu-22_04/README.md](./ubuntu-22_04/README.md) |
| Ubuntu       | 24.04   | 4124     | [ubuntu-24_04/README.md](./ubuntu-24_04/README.md) |

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
# first add the arm64 remote build host, otherwise the local machine will build arm64 images as well
docker buildx create --name sqlite-remote-ci --driver docker-container --platform linux/arm64 ssh://<user>@<host> --use
docker buildx create --name sqlite-remote-ci --driver docker-container --platform linux/amd64 --append
docker buildx inspect --bootstrap
```

### Build and push

```shell
docker buildx bake --push
```

## Mock database

The Microsoft Access 2000 Northwind sample database for SQLite3 is used as sample database.

Source: https://github.com/jpwhite3/northwind-SQLite3
