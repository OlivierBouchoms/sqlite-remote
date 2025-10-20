FROM alpine:3.22.1

RUN apk update && apk add --no-cache openssh sqlite

RUN ssh-keygen -A && echo "root:mock" | chpasswd

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

WORKDIR /db

COPY ../sample.db sqlite.db

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
