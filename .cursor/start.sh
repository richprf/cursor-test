#!/usr/bin/env bash
# Per-boot reconciliation: bring PostgreSQL online for the NestJS API.
# Idempotent — safe to run on every environment start.
set -euo pipefail

PG_VERSION=16
PG_CLUSTER=main
DB_NAME=authdb
DB_USER=authapp
DB_PASSWORD=authapp

echo "[start] Ensuring PostgreSQL ${PG_VERSION}/${PG_CLUSTER} is running..."
if ! pg_lsclusters -h 2>/dev/null | awk -v v="$PG_VERSION" -v c="$PG_CLUSTER" '$1==v && $2==c {print $4}' | grep -q online; then
  sudo pg_ctlcluster "$PG_VERSION" "$PG_CLUSTER" start || true
fi

echo "[start] Waiting for PostgreSQL to accept connections..."
for _ in $(seq 1 30); do
  if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
pg_isready -h localhost -p 5432

# Ensure the application role and database exist (no-op when the snapshot
# already carries them). Keeps the API bootable even from a fresh data dir.
sudo -u postgres psql -v ON_ERROR_STOP=1 -c \
  "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='${DB_USER}') THEN CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}'; END IF; END \$\$;"
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"
fi

echo "[start] PostgreSQL is ready on localhost:5432 (db=${DB_NAME}, user=${DB_USER})."
