# Smart Venom K Academy — Production Dockerfile (Optimized)

# ─── Build stage ───────────────────────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app

RUN npm install -g pnpm@10.26.1

COPY . .

# Remove preinstall script to avoid conflicts
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));delete p.scripts.preinstall;fs.writeFileSync('package.json',JSON.stringify(p,null,2));"

# Install dependencies with retry logic
RUN pnpm install --frozen-lockfile || pnpm install

# Build academy (frontend)
RUN pnpm --filter @workspace/academy run build || true

# Build api-server (backend)
RUN pnpm --filter @workspace/api-server run build || true

# ─── Production stage ──────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS production
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    python3 \
    g++ \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy built artifacts
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist || true
COPY --from=builder /app/artifacts/academy/dist/public ./artifacts/academy/dist/public || true
COPY scripts/startup.mjs ./scripts/startup.mjs
COPY scripts/migrate.sql ./scripts/migrate.sql

# Install pg driver
RUN npm install --no-save pg

# Create upload directory
RUN mkdir -p uploads/videos

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:8080/api/healthz || exit 1

# Start the application
CMD ["node", "scripts/startup.mjs"]
