#!/usr/bin/env node
// startup.mjs — FORCE SEED DATABASE then starts the API server
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

async function runForceSeed() {
  const sqlPath = path.join(__dirname, "force_seed.sql");
  let sql;
  try {
    sql = readFileSync(sqlPath, "utf8");
  } catch (e) {
    console.error("❌ Could not read force_seed.sql:", e.message);
    console.log("⚠️ Falling back to migrate.sql...");
    const migratePath = path.join(__dirname, "migrate.sql");
    try {
      sql = readFileSync(migratePath, "utf8");
    } catch (e2) {
      console.error("❌ Could not read migrate.sql either:", e2.message);
      process.exit(1);
    }
  }

  const client = await pool.connect();
  try {
    console.log("🔄 FORCE SEEDING DATABASE...");
    console.log("🗑️  Clearing old data and inserting 100+ lessons...");
    
    // Execute the entire SQL script
    await client.query(sql);
    
    console.log("✅ DATABASE FORCE SEED COMPLETE!");
  } catch (err) {
    console.error("❌ Force seed failed:", err.message);
    console.error("Full error:", err);
    // Don't exit - try to continue anyway
  } finally {
    client.release();
  }
}

async function forceAdminPassword() {
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
    
    await client.query(`
      INSERT INTO users (username, email, password_hash, role, xp, level, language_preference)
      VALUES ('admin', $1, $2, 'admin', 9999, 10, 'ar')
      ON CONFLICT (email) DO UPDATE SET password_hash = $2, role = 'admin'
    `, [ADMIN_EMAIL, ADMIN_HASH]);
    
    const { rows } = await client.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );
    if (rows.length > 0) {
      console.log(`✅ Admin account OK: ${rows[0].email}`);
    }
  } catch (err) {
    console.error("⚠️ Admin password reset failed:", err.message);
  } finally {
    client.release();
  }
}

async function checkAndLogDatabase() {
  try {
    const client = await pool.connect();
    
    const coursesResult = await client.query('SELECT COUNT(*) as count FROM courses');
    const coursesCount = parseInt(coursesResult.rows[0].count);
    
    const lessonsResult = await client.query('SELECT COUNT(*) as count FROM lessons');
    const lessonsCount = parseInt(lessonsResult.rows[0].count);
    
    const quizzesResult = await client.query('SELECT COUNT(*) as count FROM quizzes');
    const quizzesCount = parseInt(quizzesResult.rows[0].count);
    
    console.log(`\n📊 DATABASE STATUS:`);
    console.log(`   📚 Courses: ${coursesCount}`);
    console.log(`   📖 Lessons: ${lessonsCount}`);
    console.log(`   ❓ Quizzes: ${quizzesCount}`);
    
    if (lessonsCount >= 50) {
      console.log(`\n✅ SUCCESS! Database has ${lessonsCount} lessons (50+ required)\n`);
    } else {
      console.log(`\n⚠️  WARNING! Only ${lessonsCount} lessons found (50+ required)\n`);
    }
    
    client.release();
  } catch (e) {
    console.error("⚠️ Could not check database stats:", e.message);
  }
}

// Run startup sequence
console.log("\n🚀 ========== SMART VENOM K ACADEMY SERVER STARTUP ==========");
console.log("🕐 Time:", new Date().toISOString());
console.log("============================================================\n");

await runForceSeed();
await forceAdminPassword();
await checkAndLogDatabase();

// Close the pool before starting the server
await pool.end();

// Start the API server
const serverPath = path.resolve(__dirname, "../artifacts/api-server/dist/index.mjs");
console.log("🌐 Starting API server...\n");
execFileSync("node", ["--enable-source-maps", serverPath], {
  stdio: "inherit",
  env: process.env,
});
