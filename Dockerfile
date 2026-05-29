# Smart Venom K Academy — Production Dockerfile
# The API server is fully bundled by esbuild (bundle:true), so the production
# stage needs no node_modules — only the dist output files.

# ─── Build stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@latest

# Copy all workspace files
COPY . .

# Remove the local-dev-only preinstall guard so it does not block Docker builds
RUN node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  delete pkg.scripts.preinstall;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

RUN pnpm install --frozen-lockfile

# Build frontend (Vite → artifacts/academy/dist/public)
RUN pnpm --filter @workspace/academy run build

# Build API server (esbuild bundle → artifacts/api-server/dist/index.mjs)
RUN pnpm --filter @workspace/api-server run build

# ─── Production stage ─────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN apk add --no-cache curl

# Copy fully-bundled API server output (no node_modules needed — esbuild bundles everything)
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist

# Copy static frontend assets (served by the API's express static middleware)
COPY --from=builder /app/artifacts/academy/dist/public ./artifacts/academy/dist/public

# Create uploads directory for video files
RUN mkdir -p uploads/videos

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/api/healthz || exit 1

CMD ["node", "artifacts/api-server/dist/index.mjs"]
