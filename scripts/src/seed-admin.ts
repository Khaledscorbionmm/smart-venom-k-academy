/**
 * Seed script: upsert the default admin user.
 *
 * Usage:
 *   DATABASE_URL=<url> pnpm --filter @workspace/scripts run seed:admin
 *
 * The INSERT … ON CONFLICT clause makes this idempotent — safe to run
 * multiple times. If the admin row already exists it updates the role and
 * password_hash without touching any other columns.
 */

import { sql } from "drizzle-orm";
import { db, pool } from "@workspace/db";

const PASSWORD_HASH =
  "$2b$12$PQfMR/Sxdl7Rvt2.CQqpcO0M74SfFLHzC4Ce.LGoqy6S2tC2x820y";

async function seedAdmin(): Promise<void> {
  console.log("Seeding admin user…");

  await db.execute(sql`
    INSERT INTO users (
      username,
      email,
      password_hash,
      role,
      xp,
      level,
      streak,
      longest_streak,
      language_preference,
      created_at,
      updated_at
    )
    VALUES (
      'admin',
      'admin@smartvenomk.xyz',
      ${PASSWORD_HASH},
      'admin',
      0,
      1,
      0,
      0,
      'ar',
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO UPDATE
      SET role          = 'admin',
          password_hash = ${PASSWORD_HASH},
          updated_at    = NOW();
  `);

  console.log("✓ Admin user seeded successfully.");
}

seedAdmin()
  .catch((err: unknown) => {
    console.error("Failed to seed admin user:", err);
    process.exit(1);
  })
  .finally(() => {
    void pool.end();
  });
