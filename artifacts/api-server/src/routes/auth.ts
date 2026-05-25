import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, XP_TO_LEVEL } from "../lib/auth";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const { username, email, password, languagePreference } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: "username, email, and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
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
    email,
    passwordHash,
    languagePreference: languagePreference || "ar",
  }).returning();
  req.session.userId = user.id;
  req.session.role = user.role;
  const { passwordHash: _ph, ...safeUser } = user;
  res.status(201).json({ user: { ...safeUser, createdAt: safeUser.createdAt.toISOString() } });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  req.session.userId = user.id;
  req.session.role = user.role;
  const { passwordHash: _ph, ...safeUser } = user;
  res.json({ user: { ...safeUser, createdAt: safeUser.createdAt.toISOString() } });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {});
  res.json({ message: "Logged out" });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _ph, ...safeUser } = user;
  res.json({ ...safeUser, createdAt: safeUser.createdAt.toISOString() });
});

router.patch("/users/me/profile", requireAuth, async (req, res) => {
  const { username, languagePreference, avatarUrl } = req.body;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (username) updates.username = username;
  if (languagePreference) updates.languagePreference = languagePreference;
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.session.userId!)).returning();
  const { passwordHash: _ph, ...safeUser } = user;
  res.json({ ...safeUser, createdAt: safeUser.createdAt.toISOString() });
});

export default router;
