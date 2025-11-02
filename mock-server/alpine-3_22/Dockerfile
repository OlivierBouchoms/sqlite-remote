FROM alpine:3.22.1

RUN apk update && apk add --no-cache openssh sqlite

RUN mkdir -p /var/run/sshd && ssh-keygen -A

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's@^[[:space:]]*#\?[[:space:]]*AuthorizedKeysFile[[:space:]]*.*@AuthorizedKeysFile .ssh/authorized_keys2@' /etc/ssh/sshd_config

WORKDIR /
COPY alpine-3_22/entrypoint.sh entrypoint.sh

WORKDIR /db
COPY sample.db sqlite.db

EXPOSE 22

CMD ["/entrypoint.sh"]
