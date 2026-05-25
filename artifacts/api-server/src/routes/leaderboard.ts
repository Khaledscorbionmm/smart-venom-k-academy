import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/leaderboard", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit as string || "20"), 50);

  const users = await db.select({
    id: usersTable.id,
    username: usersTable.username,
    xp: usersTable.xp,
    level: usersTable.level,
    streak: usersTable.streak,
    avatarUrl: usersTable.avatarUrl,
  }).from(usersTable).orderBy(desc(usersTable.xp)).limit(limit);

  res.json(users.map((u, i) => ({
    rank: i + 1,
    userId: u.id,
    username: u.username,
    xp: u.xp,
    level: u.level,
    streak: u.streak,
    avatarUrl: u.avatarUrl,
  })));
});

export default router;
