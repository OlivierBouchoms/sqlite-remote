#!/usr/bin/env sh

cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys2
chown root:root ~/.ssh/authorized_keys2

/usr/sbin/sshd -D
