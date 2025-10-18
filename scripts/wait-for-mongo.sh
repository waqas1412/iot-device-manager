#!/bin/sh
# Wait for MongoDB to be ready

set -e

host="$1"
shift
cmd="$@"

echo "⏳ Waiting for MongoDB at $host to be ready..."

max_attempts=30
attempt=0

until mongosh "$host" --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ MongoDB did not become ready in time"
    exit 1
  fi
  
  echo "⏳ MongoDB is unavailable - attempt $attempt/$max_attempts - sleeping"
  sleep 2
done

echo "✅ MongoDB is ready!"

exec $cmd

