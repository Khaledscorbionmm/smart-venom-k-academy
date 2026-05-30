import { Router } from "express";
import { pool } from "@workspace/db";
import bcrypt from "bcryptjs";

const router = Router();

// Health check
router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Emergency admin reset — only works when ADMIN_INIT_TOKEN env var is set.
// Call: GET /api/setup/init?token=YOUR_TOKEN
// Remove ADMIN_INIT_TOKEN from Railway variables after use.
router.get("/setup/init", async (req, res) => {
  const initToken = process.env.ADMIN_INIT_TOKEN;
  if (!initToken) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (req.query.token !== initToken) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const newPassword = "SmartVenom@2026";
  const newHash = await bcrypt.hash(newPassword, 12);
  const client = await pool.connect();
  try {
    // Ensure session table exists
    await client.query(`CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
    )`);

    // Ensure enums exist
    await client.query(`DO \$\$ BEGIN CREATE TYPE role AS ENUM ('student', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END \$\$`);
    await client.query(`DO \$\$ BEGIN CREATE TYPE lang_pref AS ENUM ('ar', 'en'); EXCEPTION WHEN duplicate_object THEN NULL; END \$\$`);

    // Ensure users table exists
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY, username text NOT NULL UNIQUE, email text NOT NULL UNIQUE,
      password_hash text NOT NULL, role role NOT NULL DEFAULT 'student',
      xp integer NOT NULL DEFAULT 0, level integer NOT NULL DEFAULT 1,
      streak integer NOT NULL DEFAULT 0, longest_streak integer NOT NULL DEFAULT 0,
      last_activity_date text, last_login_at timestamp, last_login_ip text,
      login_location text, language_preference lang_pref NOT NULL DEFAULT 'ar',
      avatar_url text, created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )`);

    // Upsert admin
    await client.query(`
      INSERT INTO users (username, email, password_hash, role, xp, level, language_preference)
      VALUES ('admin', 'admin@smartvenomk.com', \$1, 'admin', 9999, 10, 'ar')
      ON CONFLICT (email) DO UPDATE SET
        role = 'admin',
        password_hash = \$1,
        updated_at = NOW()
    `, [newHash]);

    const { rows } = await client.query(
      "SELECT id, email, role FROM users WHERE email = 'admin@smartvenomk.com'"
    );

    res.json({
      success: true,
      message: "Admin account reset successfully. Remove ADMIN_INIT_TOKEN from Railway variables now.",
      admin: rows[0],
      credentials: {
        email: "admin@smartvenomk.com",
        password: newPassword
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
