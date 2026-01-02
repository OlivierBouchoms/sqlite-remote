FROM alpine:3.23.2

RUN apk update && apk add --no-cache openssh sqlite

RUN mkdir -p /var/run/sshd && ssh-keygen -A

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's@^[[:space:]]*#\?[[:space:]]*AuthorizedKeysFile[[:space:]]*.*@AuthorizedKeysFile .ssh/authorized_keys2@' /etc/ssh/sshd_config

WORKDIR /
COPY alpine-3_23/entrypoint.sh entrypoint.sh

WORKDIR /db
COPY sample.db sqlite.db

EXPOSE 22

CMD ["/entrypoint.sh"]
