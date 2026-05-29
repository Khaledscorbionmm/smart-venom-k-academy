/**
 * Seed script: creates the default admin user if one does not already exist.
 *
 * Bundled into a single self-contained .mjs file via esbuild so it can run
 * in the production Alpine image with just `node /app/seed-admin.mjs` —
 * no pnpm, no workspace packages, no node_modules required.
 *
 * Safe to run multiple times (idempotent).
 */

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("[seed-admin] ERROR: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@k-academy.app";
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("[seed-admin] Checking for existing admin user…");

  // Use raw SQL so this script has zero dependency on the workspace schema
  // package at runtime — everything is bundled by esbuild.
  const existing = await db.execute(
    `SELECT id FROM users WHERE email = '${ADMIN_EMAIL.replace(/'/g, "''")}' LIMIT 1`
  );

  if (existing.rows.length > 0) {
    console.log(`[seed-admin] Admin user already exists (email: ${ADMIN_EMAIL}). Nothing to do.`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await db.execute(
    `INSERT INTO users (username, email, password_hash, role, xp, level, streak, longest_streak, language_preference, created_at, updated_at)
     VALUES (
       '${ADMIN_USERNAME.replace(/'/g, "''")}',
       '${ADMIN_EMAIL.replace(/'/g, "''")}',
       '${passwordHash.replace(/'/g, "''")}',
       'admin',
       0, 1, 0, 0,
       'ar',
       NOW(), NOW()
     )`
  );

  console.log(`[seed-admin] ✓ Admin user created successfully.`);
  console.log(`[seed-admin]   Email:    ${ADMIN_EMAIL}`);
  console.log(`[seed-admin]   Username: ${ADMIN_USERNAME}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.warn("[seed-admin] WARNING: Using default password. Set SEED_ADMIN_PASSWORD env var before running in production.");
  }
}

seed()
  .then(() => {
    console.log("[seed-admin] Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[seed-admin] FAILED:", err);
    process.exit(1);
  })
  .finally(() => {
    pool.end().catch(() => {});
  });
