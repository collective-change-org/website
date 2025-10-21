FROM node:23-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/website/package.json ./apps/website/package.json
COPY apps/payload/package.json ./apps/payload/package.json
COPY turbo.json tsconfig.base.jsonc ./

# ---- Dependencies stage ----
FROM base AS build-deps
RUN corepack enable pnpm

# Install all dependencies (including workspace deps)
RUN pnpm install --frozen-lockfile

# ---- Production Dependencies stage ----
FROM base AS prod-deps
RUN corepack enable pnpm

RUN pnpm install --frozen-lockfile --production

# ---- Builder stage ----
FROM build-deps AS builder

# Accept build arguments
ARG PAYLOAD_EMAIL
ARG PAYLOAD_PASSWORD
ARG CMS_URL

# Make them available as environment variables during build
ENV PAYLOAD_EMAIL=$PAYLOAD_EMAIL
ENV PAYLOAD_PASSWORD=$PAYLOAD_PASSWORD
ENV CMS_URL=$CMS_URL

# Copy source code
COPY . .

# Build the website
RUN pnpm --filter @collectivechange/website build

# ---- Runner stage ----
FROM base AS runner

# Accept runtime arguments
ARG PAYLOAD_EMAIL
ARG PAYLOAD_PASSWORD
ARG CMS_URL

# Set runtime environment variables
ENV NODE_ENV=production
ENV PAYLOAD_EMAIL=$PAYLOAD_EMAIL
ENV PAYLOAD_PASSWORD=$PAYLOAD_PASSWORD
ENV CMS_URL=$CMS_URL
ENV HOST=0.0.0.0
ENV PORT=4321

# Copy workspace configuration and all dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=prod-deps /app/node_modules ./node_modules
# COPY --from=builder /app/apps ./apps

# Copy built application
COPY --from=builder /app/apps/website/dist ./dist

# Create a non-root user and change ownership
RUN addgroup --system --gid 1001 nodejs && \
	adduser --system --uid 1001 astrojs && \
	chown -R astrojs:nodejs /app

# Switch to non-root user
USER astrojs

# Expose the web port and start
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
