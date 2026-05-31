#!/usr/bin/env node
import { readFileSync, existsSync } from "fs";
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

async function runForceSeed() {
  const sqlPath = path.join(__dirname, "force_seed.sql");
  if (!existsSync(sqlPath)) {
    console.error("❌ force_seed.sql not found at:", sqlPath);
    return;
  }

  const client = await pool.connect();
  try {
    console.log("🔄 FORCE SEEDING DATABASE...");
    const sql = readFileSync(sqlPath, "utf8");
    await client.query(sql);
    console.log("✅ DATABASE FORCE SEED COMPLETE!");
  } catch (err) {
    console.error("❌ Force seed failed:", err.message);
  } finally {
    client.release();
  }
}

async function checkDatabase() {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT COUNT(*) as count FROM lessons');
    console.log(`📊 Lessons in database: ${rows[0].count}`);
    client.release();
  } catch (e) {
    console.error("⚠️ Database check failed:", e.message);
  }
}

console.log("\n🚀 STARTING SMART VENOM K ACADEMY...");
await runForceSeed();
await checkDatabase();
await pool.end();

// Find server path dynamically
const possiblePaths = [
  path.resolve(__dirname, "../artifacts/api-server/dist/index.mjs"),
  path.resolve(__dirname, "../artifacts/api-server/dist/index.js"),
  path.resolve(__dirname, "artifacts/api-server/dist/index.mjs")
];

let serverPath = null;
for (const p of possiblePaths) {
  if (existsSync(p)) {
    serverPath = p;
    break;
  }
}

if (!serverPath) {
  console.error("❌ Server index file not found!");
  process.exit(1);
}

console.log(`🌐 Starting API server from: ${serverPath}`);
execFileSync("node", [serverPath], { stdio: "inherit", env: process.env });
