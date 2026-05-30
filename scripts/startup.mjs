#!/usr/bin/env node
// startup.mjs — runs DB migration then starts the API server
// Used as the Railway production CMD instead of running the server directly.
// Usage: node scripts/startup.mjs

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import pg from "pg";
import { execFileSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set!");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

async function runMigration() {
  const sqlPath = path.join(__dirname, "migrate.sql");
  let sql;
  try {
    sql = readFileSync(sqlPath, "utf8");
  } catch (e) {
    console.error("❌ Could not read migrate.sql:", e.message);
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    console.log("🔄 Running database migration...");
    await client.query(sql);
    console.log("✅ Database migration complete.");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

await runMigration();

// Start the API server
const serverPath = path.resolve(__dirname, "../artifacts/api-server/dist/index.mjs");
console.log("🚀 Starting API server...");
execFileSync("node", ["--enable-source-maps", serverPath], {
  stdio: "inherit",
  env: process.env,
});
