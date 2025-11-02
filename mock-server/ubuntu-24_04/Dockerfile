FROM ubuntu:24.04

RUN apt-get update && \
    apt-get install -y --no-install-recommends sqlite3 openssh-server && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/run/sshd && ssh-keygen -A

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's@^[[:space:]]*#\?[[:space:]]*AuthorizedKeysFile[[:space:]]*.*@AuthorizedKeysFile .ssh/authorized_keys2@' /etc/ssh/sshd_config

WORKDIR /
COPY ubuntu-24_04/entrypoint.sh entrypoint.sh

WORKDIR /db
COPY sample.db sqlite.db

EXPOSE 22

CMD ["/entrypoint.sh"]
