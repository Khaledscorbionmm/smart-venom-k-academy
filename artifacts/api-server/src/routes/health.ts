import { Router } from "express";
import { pool } from "@workspace/db";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// One-time admin reset endpoint
// Works with ADMIN_INIT_TOKEN env var OR with the hardcoded fallback token
// Remove or disable after use
router.get("/setup/init", async (req, res) => {
  const FALLBACK_TOKEN = "SVK-ADMIN-2026-RESET";
  const envToken = process.env.ADMIN_INIT_TOKEN;
  const validTokens = envToken ? [envToken, FALLBACK_TOKEN] : [FALLBACK_TOKEN];
  const provided = String(req.query.token || "");

  if (!validTokens.includes(provided)) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  const newPassword = "SmartVenom@2026";
  const newHash = await bcrypt.hash(newPassword, 12);
  const client = await pool.connect();
  try {
    await client.query();
    await client.query();

    await client.query();

    await client.query();

    await client.query(
      `INSERT INTO users (username, email, password_hash, role, xp, level, language_preference)
       VALUES ('admin', 'admin@smartvenomk.com', \$1, 'admin', 9999, 10, 'ar')
       ON CONFLICT (email) DO UPDATE SET
         role = 'admin', password_hash = \$1, updated_at = NOW()`,
      [newHash]
    );

    const { rows } = await client.query(
      "SELECT id, email, role, updated_at FROM users WHERE email = 'admin@smartvenomk.com'"
    );

    res.json({
      success: true,
      message: "Admin password reset successfully!",
      admin: rows[0],
      login: { email: "admin@smartvenomk.com", password: newPassword }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
