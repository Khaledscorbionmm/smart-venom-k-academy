import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, userLoginsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, XP_TO_LEVEL } from "../lib/auth";

const router = Router();

// ─── Register ──────────────────────────────────────────────────────────────
router.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password, languagePreference } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ error: "username, email, and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }
    const existingUsername = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (existingUsername.length > 0) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      username,
      email: email.toLowerCase(),
      passwordHash,
      languagePreference: languagePreference || "ar",
    }).returning();

    req.session.userId = user.id;
    req.session.role = user.role;
    const { passwordHash: _ph, ...safeUser } = user;
    res.status(201).json({ user: { ...safeUser, createdAt: safeUser.createdAt.toISOString() } });
  } catch (err: any) {
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ─── Login ─────────────────────────────────────────────────────────────────
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Track login: IP, location, timestamp
    const ipAddress = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();
    const now = new Date();
    let location: string | null = null;

    try {
      const geoRes = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
        signal: AbortSignal.timeout(2000),
      }).catch(() => null);
      if (geoRes && geoRes.ok) {
        const geo = await geoRes.json() as { city?: string; country_name?: string };
        if (geo.city && geo.country_name) {
          location = `${geo.city}, ${geo.country_name}`;
        }
      }
    } catch {
      // Silently skip geolocation failure
    }

    await db.update(usersTable).set({
      lastLoginAt: now,
      lastLoginIp: ipAddress,
      loginLocation: location,
      updatedAt: now,
    }).where(eq(usersTable.id, user.id));

    await db.insert(userLoginsTable).values({
      userId: user.id,
      ipAddress,
      location,
      userAgent: req.headers["user-agent"] || null,
    });

    req.session.userId = user.id;
    req.session.role = user.role;

    const { passwordHash: _ph, ...safeUser } = user;
    res.json({
      user: {
        ...safeUser,
        createdAt: safeUser.createdAt.toISOString(),
        lastLoginAt: now.toISOString(),
        lastLoginIp: ipAddress,
        loginLocation: location,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ─── Logout ────────────────────────────────────────────────────────────────
router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {});
  res.clearCookie("svk.sid");
  res.json({ message: "Logged out" });
});

// ─── Get current user ──────────────────────────────────────────────────────
router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.id, req.session.userId!))
      .limit(1);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    const { passwordHash: _ph, ...safeUser } = user;
    res.json({ ...safeUser, createdAt: safeUser.createdAt.toISOString() });
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ─── Update profile ────────────────────────────────────────────────────────
router.patch("/users/me/profile", requireAuth, async (req, res) => {
  try {
    const { username, languagePreference, avatarUrl } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (username) updates.username = username;
    if (languagePreference) updates.languagePreference = languagePreference;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
    const [user] = await db.update(usersTable).set(updates)
      .where(eq(usersTable.id, req.session.userId!))
      .returning();
    const { passwordHash: _ph, ...safeUser } = user;
    res.json({ ...safeUser, createdAt: safeUser.createdAt.toISOString() });
  } catch {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ─── Change password ────────────────────────────────────────────────────────
router.post("/auth/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "currentPassword and newPassword are required" });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.id, req.session.userId!))
      .limit(1);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({
      passwordHash: newHash,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    res.json({ success: true, message: "Password changed successfully" });
  } catch {
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
