#!/usr/bin/env python3
"""Verify connectivity to the Impala cluster before wiring up the real sync job.

Usage: python3 scripts/test_impala_connection.py
Reads connection settings from .env in the repo root (see .env.example).
"""
import sys
from pathlib import Path

from dotenv import dotenv_values
from impala.dbapi import connect

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env"


def load_config() -> dict[str, str]:
    env = {**dotenv_values(ENV_FILE)}
    missing = [k for k in ("IMPALA_HOST", "IMPALA_USER", "IMPALA_PASSWORD") if not env.get(k)]
    if missing:
        raise SystemExit(f"Missing required settings in {ENV_FILE}: {', '.join(missing)}")
    return env


def main() -> None:
    env = load_config()
    host = env["IMPALA_HOST"]
    port = int(env.get("IMPALA_PORT", "21050"))
    database = env.get("IMPALA_DATABASE", "default")
    user = env["IMPALA_USER"]
    password = env["IMPALA_PASSWORD"]

    print(f"Connecting to impala://{host}:{port}/{database} as {user} ...")
    conn = connect(
        host=host,
        port=port,
        database=database,
        user=user,
        password=password,
        auth_mechanism="PLAIN",
        use_ssl=True,
        verify_cert=True,
    )
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        print("Connection OK, SELECT 1 ->", cursor.fetchall())

        cursor.execute("SHOW DATABASES")
        databases = [row[0] for row in cursor.fetchall()]
        print(f"Visible databases ({len(databases)}):")
        for name in databases:
            print(f"  - {name}")
    finally:
        conn.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001 - top-level diagnostic entry point
        print(f"Connection FAILED: {exc}", file=sys.stderr)
        sys.exit(1)
