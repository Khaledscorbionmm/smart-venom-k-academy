# Smart Venom K Academy - Production Dockerfile

# ─── Stage 1: Build frontend ───────────────────────────────────────────────
FROM node:22-alpine AS frontend-build
WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY lib ./lib
COPY artifacts/academy ./artifacts/academy
COPY artifacts/api-server ./artifacts/api-server

# Set user agent so preinstall script recognizes pnpm
ENV npm_config_user_agent="pnpm/latest npm/? node/v22 linux x64"
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/academy run build

# ─── Stage 2: Build API server ─────────────────────────────────────────────
FROM node:22-alpine AS api-build
WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY lib ./lib
COPY artifacts/api-server ./artifacts/api-server

ENV npm_config_user_agent="pnpm/latest npm/? node/v22 linux x64"
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/api-server run build

# ─── Stage 3: Production image ─────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@latest && apk add --no-cache curl

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/db/package.json ./lib/db/package.json
COPY lib/api-client-react/package.json ./lib/api-client-react/package.json
COPY lib/api-spec/package.json ./lib/api-spec/package.json
COPY lib/api-zod/package.json ./lib/api-zod/package.json
COPY artifacts/api-server/package.json ./artifacts/api-server/package.json

ENV npm_config_user_agent="pnpm/latest npm/? node/v22 linux x64"
RUN pnpm install --frozen-lockfile --prod

COPY --from=frontend-build /app/artifacts/academy/dist/public ./artifacts/academy/dist/public
COPY --from=api-build /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY lib ./lib

RUN mkdir -p uploads/videos

ENV NODE_ENV=production
ENV PORT=8080
ENV BASE_PATH=/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/api/healthz || exit 1

CMD ["node", "artifacts/api-server/dist/index.mjs"]
