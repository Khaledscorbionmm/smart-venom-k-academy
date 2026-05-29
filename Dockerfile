# Smart Venom K Academy — Production Dockerfile
# The API server is fully bundled by esbuild (bundle:true), so the production
# stage needs no node_modules — only the dist output files.

# ─── Build stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@latest

COPY . .

# Remove the local-dev-only preinstall guard so it does not block Docker builds
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));delete p.scripts.preinstall;fs.writeFileSync('package.json',JSON.stringify(p,null,2));"

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/academy run build

RUN pnpm --filter @workspace/api-server run build

# ─── Production stage ─────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/academy/dist/public ./artifacts/academy/dist/public

RUN mkdir -p uploads/videos

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/api/healthz || exit 1

CMD ["node", "artifacts/api-server/dist/index.mjs"]
