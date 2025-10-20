FROM ubuntu:22.04

RUN apt-get update && apt-get install -y sqlite3 openssh-server

RUN mkdir -p /var/run/sshd && systemctl enable ssh

RUN ssh-keygen -A && echo "root:mock" | chpasswd

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

WORKDIR /db

COPY ../sample.db sqlite.db

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
