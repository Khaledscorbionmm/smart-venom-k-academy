# Smart Venom K Academy — Production Dockerfile
# Build stage uses Debian (glibc) to match Replit's environment where the lockfile was created.

# ─── Build stage (Debian/glibc — matches Replit's libc) ───────────────────
FROM node:22-slim AS builder
WORKDIR /app

RUN npm install -g pnpm@10.26.1

COPY . .

# Remove the local-dev-only preinstall guard so it does not block Docker builds
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));delete p.scripts.preinstall;fs.writeFileSync('package.json',JSON.stringify(p,null,2));"

RUN pnpm install --frozen-lockfile

# Build frontend (Vite → artifacts/academy/dist/public)
RUN pnpm --filter @workspace/academy run build

# Build API server (esbuild bundle → artifacts/api-server/dist/index.mjs)
RUN pnpm --filter @workspace/api-server run build

# ─── Production stage (Debian slim — needed for glibc native modules + language tools) ───────
FROM node:22-slim AS production
WORKDIR /app

# Install curl for healthcheck + language runtimes for code executor
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    python3 \
    python3-pip \
    g++ \
    gcc \
    default-jdk \
    golang \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy fully-bundled API server (esbuild bundles all deps, no node_modules needed)
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist

# Copy frontend static assets (served by Express in production mode)
COPY --from=builder /app/artifacts/academy/dist/public ./artifacts/academy/dist/public

# Copy startup script (runs DB migration then starts server)
COPY scripts/startup.mjs ./scripts/startup.mjs
COPY scripts/migrate.sql ./scripts/migrate.sql

# pg is needed by startup.mjs for migration (install lightweight)
RUN npm install --no-save pg

# Directory for video file uploads
RUN mkdir -p uploads/videos

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:8080/api/healthz || exit 1

# startup.mjs: runs DB migration first, then starts the API server
CMD ["node", "scripts/startup.mjs"]
