# Smart Venom K Academy - Production Dockerfile
# Multi-stage build: frontend + API server

# ─── Stage 1: Build frontend ───────────────────────────────────────────────
FROM node:22-alpine AS frontend-build
WORKDIR /app

RUN npm install -g pnpm@latest

# Copy workspace manifests and lock file
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig*.json ./

# Copy all lib packages (needed for workspace resolution)
COPY lib ./lib

# Copy frontend and api-server source
COPY artifacts/academy ./artifacts/academy
COPY artifacts/api-server ./artifacts/api-server

# Install all deps (network available at build time)
RUN pnpm install --frozen-lockfile

# Build frontend (outputs to artifacts/academy/dist/public)
RUN pnpm --filter @workspace/academy run build

# ─── Stage 2: Build API server ─────────────────────────────────────────────
FROM node:22-alpine AS api-build
WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY lib ./lib
COPY artifacts/api-server ./artifacts/api-server

RUN pnpm install --frozen-lockfile

# Build API server (outputs to artifacts/api-server/dist/)
RUN pnpm --filter @workspace/api-server run build

# ─── Stage 3: Production image ─────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@latest && apk add --no-cache curl

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all lib package.json files for production install
COPY lib/db/package.json ./lib/db/package.json
COPY lib/api-client-react/package.json ./lib/api-client-react/package.json
COPY lib/api-spec/package.json ./lib/api-spec/package.json
COPY lib/api-zod/package.json ./lib/api-zod/package.json
COPY artifacts/api-server/package.json ./artifacts/api-server/package.json

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from previous stages
COPY --from=frontend-build /app/artifacts/academy/dist/public ./artifacts/academy/dist/public
COPY --from=api-build /app/artifacts/api-server/dist ./artifacts/api-server/dist

# Copy lib source (used at runtime by api-server via ts imports -> compiled)
COPY lib ./lib

# Uploads directory for videos
RUN mkdir -p uploads/videos

# Environment
ENV NODE_ENV=production
ENV PORT=8080
ENV BASE_PATH=/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/api/healthz || exit 1

CMD ["node", "artifacts/api-server/dist/index.mjs"]
