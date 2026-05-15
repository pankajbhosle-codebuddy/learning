#!/bin/sh

KEYFILE=/data/keyfile/mongo-keyfile

if [ ! -f "$KEYFILE" ]; then
  echo "Generating MongoDB keyfile..."

  openssl rand -base64 756 > "$KEYFILE"

  chmod 400 "$KEYFILE"

  chown mongodb:mongodb "$KEYFILE"
fi

exec docker-entrypoint.sh mongod \
  --bind_ip_all \
  --replSet rs0 \
  --keyFile "$KEYFILE" \
  --auth
