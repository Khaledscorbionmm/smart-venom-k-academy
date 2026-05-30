import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "path";

const PgSession = connectPgSimple(session);

const app: Express = express();

// Trust all proxy headers (Railway uses multiple proxy layers)
app.set("trust proxy", true);

// Security: Helmet headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// Rate limiting: 500 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { error: "Too many login attempts. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// CORS: allow any origin that sends credentials (reflects origin back)
app.use(cors({
  origin: (origin, cb) => cb(null, origin || true),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session hardening
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV === "production") {
  logger.error("SESSION_SECRET is not set! Shutting down.");
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    store: new PgSession({
      pool,
      createTableIfMissing: true,
      tableName: "session",
    }),
    secret: sessionSecret || "dev-secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    name: "svk.sid",
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    },
  }),
);

// Apply auth rate limit to login/register
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api", router);

// Serve uploaded videos statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Serve the React frontend in production
if (process.env.NODE_ENV === "production") {
  const cwd = process.cwd();
  const isRunningFromApiServerDir = cwd.endsWith("api-server") || cwd.endsWith("api-server/");
  const defaultFrontendPath = isRunningFromApiServerDir
    ? path.resolve(cwd, "../academy/dist/public")
    : path.join(cwd, "artifacts/academy/dist/public");
  const frontendDist = process.env.FRONTEND_DIST_PATH || defaultFrontendPath;
  app.use(express.static(frontendDist));
  app.get("*splat", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
