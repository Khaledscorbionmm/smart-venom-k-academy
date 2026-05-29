# Smart Venom K Academy — Production Dockerfile
# Build stage uses Debian (glibc) to match Replit's environment where the lockfile was created.
# Native modules like rollup use glibc binaries; Alpine (musl) causes MODULE_NOT_FOUND errors.
# Production stage is minimal Alpine since the api-server is a fully self-contained esbuild bundle.

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

# Build seed script (esbuild bundle → scripts/dist/seed-admin.mjs)
RUN pnpm --filter @workspace/scripts run build:seed

# ─── Production stage (Alpine — tiny image, no node_modules needed) ───────
FROM node:22-alpine AS production
WORKDIR /app

RUN apk add --no-cache curl

# Copy fully-bundled API server (esbuild bundles all deps, no node_modules needed)
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist

# Copy frontend static assets (served by Express in production mode)
COPY --from=builder /app/artifacts/academy/dist/public ./artifacts/academy/dist/public

# Copy bundled seed script (run with: node /app/seed-admin.mjs)
COPY --from=builder /app/scripts/dist/seed-admin.mjs ./seed-admin.mjs

# Directory for video file uploads
RUN mkdir -p uploads/videos

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/api/healthz || exit 1

CMD ["node", "artifacts/api-server/dist/index.mjs"]
