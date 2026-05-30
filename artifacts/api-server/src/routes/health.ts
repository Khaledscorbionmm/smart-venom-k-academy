import { Router } from "express";
import { pool } from "@workspace/db";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// One-time admin reset endpoint. Hardcoded token: SVK-ADMIN-2026-RESET
// Also works with ADMIN_INIT_TOKEN env var if set.
// Disable this endpoint after use by removing the route or env var.
router.get("/setup/init", async (req, res) => {
  const FALLBACK_TOKEN = "SVK-ADMIN-2026-RESET";
  const envToken = process.env.ADMIN_INIT_TOKEN;
  const provided = String(req.query.token || "");
  const valid = provided === FALLBACK_TOKEN || (envToken && provided === envToken);

  if (!valid) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  const newPassword = "SmartVenom@2026";
  const newHash = await bcrypt.hash(newPassword, 12);
  const client = await pool.connect();
  try {
    // Ensure enums exist
    await client.query(
      "DO $do$ BEGIN CREATE TYPE role AS ENUM ('student', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $do$"
    );
    await client.query(
      "DO $do$ BEGIN CREATE TYPE lang_pref AS ENUM ('ar', 'en'); EXCEPTION WHEN duplicate_object THEN NULL; END $do$"
    );

    // Ensure session table exists
    await client.query(
      'CREATE TABLE IF NOT EXISTS "session" (' +
      '"sid" varchar NOT NULL COLLATE "default",' +
      '"sess" json NOT NULL,' +
      '"expire" timestamp(6) NOT NULL,' +
      'CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE' +
      ")"
    );

    // Ensure users table exists
    await client.query(
      "CREATE TABLE IF NOT EXISTS users (" +
      "id serial PRIMARY KEY, username text NOT NULL UNIQUE, email text NOT NULL UNIQUE," +
      "password_hash text NOT NULL, role role NOT NULL DEFAULT 'student'," +
      "xp integer NOT NULL DEFAULT 0, level integer NOT NULL DEFAULT 1," +
      "streak integer NOT NULL DEFAULT 0, longest_streak integer NOT NULL DEFAULT 0," +
      "last_activity_date text, last_login_at timestamp, last_login_ip text," +
      "login_location text, language_preference lang_pref NOT NULL DEFAULT 'ar'," +
      "avatar_url text, created_at timestamp NOT NULL DEFAULT now()," +
      "updated_at timestamp NOT NULL DEFAULT now())"
    );

    // Upsert admin user
    await client.query(
      "INSERT INTO users (username, email, password_hash, role, xp, level, language_preference) " +
      "VALUES ('admin', 'admin@smartvenomk.com', $1, 'admin', 9999, 10, 'ar') " +
      "ON CONFLICT (email) DO UPDATE SET role = 'admin', password_hash = $1, updated_at = NOW()",
      [newHash]
    );

    const { rows } = await client.query(
      "SELECT id, email, role, updated_at FROM users WHERE email = 'admin@smartvenomk.com'"
    );

    res.json({
      success: true,
      message: "Admin password reset successfully!",
      admin: rows[0],
      login: { email: "admin@smartvenomk.com", password: newPassword },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
