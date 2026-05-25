import { type Request, type Response, type NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    userId: number;
    role: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (req.session.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

export function XP_TO_LEVEL(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}
