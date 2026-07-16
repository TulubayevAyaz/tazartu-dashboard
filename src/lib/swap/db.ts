import path from "path";
import { mkdirSync } from "fs";
import Database from "better-sqlite3";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "swap.db");

let db: Database.Database | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS dataset (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  sheet_date_label TEXT,
  source_file_name TEXT,
  parsed_at TEXT,
  detail_fetched_at TEXT,
  detail_object_count INTEGER,
  planbp_total REAL, planbp_znk REAL, planbp_swap REAL,
  plandup_total REAL, plandup_znk REAL, plandup_swap REAL,
  smr_total REAL, smr_znk REAL, smr_swap REAL,
  accepted_total REAL, accepted_znk REAL, accepted_swap REAL,
  delta_total REAL, delta_znk REAL, delta_swap REAL,
  sales_total REAL, sales_znk REAL, sales_swap REAL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  planbp_total REAL, planbp_znk REAL, planbp_swap REAL,
  plandup_total REAL, plandup_znk REAL, plandup_swap REAL,
  smr_total REAL, smr_znk REAL, smr_swap REAL,
  accepted_total REAL, accepted_znk REAL, accepted_swap REAL,
  delta_total REAL, delta_znk REAL, delta_swap REAL
);

CREATE TABLE IF NOT EXISTS monthly (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,
  month_index INTEGER NOT NULL,
  year INTEGER NOT NULL,
  method TEXT NOT NULL,
  planbp_total REAL, planbp_znk REAL, planbp_swap REAL,
  plandup_total REAL, plandup_znk REAL, plandup_swap REAL,
  smr_total REAL, smr_znk REAL, smr_swap REAL,
  accepted_total REAL, accepted_znk REAL, accepted_swap REAL,
  delta_total REAL, delta_znk REAL, delta_swap REAL,
  sales_total REAL, sales_znk REAL, sales_swap REAL
);

CREATE TABLE IF NOT EXISTS contractors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contractor TEXT NOT NULL,
  planned_ports REAL,
  accepted_ports REAL,
  remaining_ports REAL,
  progress_pct REAL,
  object_count INTEGER,
  top_delay_reasons_json TEXT,
  projects_json TEXT,
  cities_json TEXT
);

CREATE TABLE IF NOT EXISTS regions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region TEXT NOT NULL,
  planned_ports REAL,
  accepted_ports REAL,
  progress_pct REAL
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS top_delay_reasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reason TEXT NOT NULL,
  count INTEGER NOT NULL,
  rank INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS snapshot_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

export function getDb(): Database.Database {
  if (db) return db;
  mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);
  return db;
}
