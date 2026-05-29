import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@smartvenomk.xyz";
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "changeme123";

async function seedAdmin() {
  console.log("[seed-admin] Checking for existing admin user…");

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log(
      `[seed-admin] Admin user already exists (${ADMIN_EMAIL}). Skipping.`,
    );
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const [user] = await db
    .insert(usersTable)
    .values({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      languagePreference: "ar",
    })
    .returning();

  console.log(`[seed-admin] ✓ Admin user created successfully.`);
  console.log(`[seed-admin]   Email:    ${user.email}`);
  console.log(`[seed-admin]   Username: ${user.username}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.warn(
      "[seed-admin] WARNING: Using default password. Set SEED_ADMIN_PASSWORD before production.",
    );
  }
}

seedAdmin()
  .then(() => {
    console.log("[seed-admin] Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[seed-admin] FAILED:", err);
    process.exit(1);
  });
