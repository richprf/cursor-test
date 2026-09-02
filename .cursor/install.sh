#!/usr/bin/env bash
# Idempotent repository bootstrap for the NextAuth + NestJS auth app.
# Runs after the source is checked out. Safe to run repeatedly.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PG_VERSION=16
PG_CLUSTER=main
DB_NAME=authdb
DB_USER=authapp
DB_PASSWORD=authapp

# --- System dependency: PostgreSQL ------------------------------------------
# Normally baked into the environment's base snapshot; this guard makes the
# script self-sufficient on Cursor's default image too.
if ! command -v pg_ctlcluster >/dev/null 2>&1; then
  echo "[install] PostgreSQL not found — installing..."
  sudo apt-get update -y
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-contrib
fi

# --- Bring the database online (needed for prisma migrate below) ------------
if ! pg_lsclusters -h 2>/dev/null | awk -v v="$PG_VERSION" -v c="$PG_CLUSTER" '$1==v && $2==c {print $4}' | grep -q online; then
  sudo pg_ctlcluster "$PG_VERSION" "$PG_CLUSTER" start || true
fi
for _ in $(seq 1 30); do
  pg_isready -h localhost -p 5432 >/dev/null 2>&1 && break
  sleep 1
done
pg_isready -h localhost -p 5432

sudo -u postgres psql -v ON_ERROR_STOP=1 -c \
  "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='${DB_USER}') THEN CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}'; END IF; END \$\$;"
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"
fi

# --- Local dev env files (generated once, then preserved) -------------------
# These hold throwaway development secrets only. Real Google OAuth credentials
# are optional and can be added later to enable the "Sign in with Google" flow.
if [ ! -f backend/.env ]; then
  echo "[install] Creating backend/.env from example..."
  cp backend/.env.example backend/.env
  sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$(openssl rand -base64 32)|" backend/.env
fi
if [ ! -f frontend/.env.local ]; then
  echo "[install] Creating frontend/.env.local from example..."
  cp frontend/.env.local.example frontend/.env.local
  sed -i "s|^NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$(openssl rand -base64 32)|" frontend/.env.local
fi

# --- Dependencies + database schema -----------------------------------------
echo "[install] Installing backend dependencies..."
( cd backend && npm ci && npx prisma migrate deploy )

echo "[install] Installing frontend dependencies..."
( cd frontend && npm ci )

echo "[install] Done."
