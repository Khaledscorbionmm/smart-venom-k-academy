# Smart Venom K Academy — Production Dockerfile

# ─── Build stage ───────────────────────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app

RUN npm install -g pnpm@10.26.1

COPY . .

RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));delete p.scripts.preinstall;fs.writeFileSync('package.json',JSON.stringify(p,null,2));"

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/academy run build
RUN pnpm --filter @workspace/api-server run build

# ─── Production stage ──────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS production
WORKDIR /app

# Install language runtimes for code executor + curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends     curl     python3     g++     gcc     && apt-get clean     && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/academy/dist/public ./artifacts/academy/dist/public
COPY scripts/startup.mjs ./scripts/startup.mjs
COPY scripts/migrate.sql ./scripts/migrate.sql

RUN npm install --no-save pg

RUN mkdir -p uploads/videos

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5   CMD curl -f http://localhost:8080/api/healthz || exit 1

CMD ["node", "scripts/startup.mjs"]
