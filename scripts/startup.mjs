#!/usr/bin/env node
// startup.mjs — runs DB migration then starts the API server
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
  }
}

async function forceAdminPassword() {
  // Always ensure admin has correct password on every startup
  const ADMIN_EMAIL = 'admin@smartvenomk.com';
  const ADMIN_HASH = '$2b$12$DyMGPAHjHtIKROGAn6HJoecr6JX6wHwUpVpUSScheWKhz6dSYmiL.';

  const client = await pool.connect();
  try {
    console.log("🔐 Ensuring admin account is correct...");
    await client.query(`
      UPDATE users
      SET password_hash = $1, role = 'admin', updated_at = NOW()
      WHERE email = $2
    `, [ADMIN_HASH, ADMIN_EMAIL]);
    
    // Also insert if somehow not there
    await client.query(`
      INSERT INTO users (username, email, password_hash, role, xp, level, language_preference)
      VALUES ('admin', $2, $1, 'admin', 9999, 10, 'ar')
      ON CONFLICT (email) DO NOTHING
    `, [ADMIN_HASH, ADMIN_EMAIL]);
    
    const { rows } = await client.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );
    if (rows.length > 0) {
      console.log(`✅ Admin account OK: ${rows[0].email} (id=${rows[0].id}, role=${rows[0].role})`);
    } else {
      console.error("❌ Admin account not found after upsert!");
    }
  } catch (err) {
    console.error("❌ Admin password reset failed:", err.message);
    // Non-fatal — continue server startup
  } finally {
    client.release();
    await pool.end();
  }
}

await runMigration();
await forceAdminPassword();

// Start the API server
const serverPath = path.resolve(__dirname, "../artifacts/api-server/dist/index.mjs");
console.log("🚀 Starting API server...");
execFileSync("node", ["--enable-source-maps", serverPath], {
  stdio: "inherit",
  env: process.env,
});
