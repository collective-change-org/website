# ---- Base image ----
FROM node:23-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app


# ---- Builder stage ----
FROM base AS builder

# Accept build arguments for use during build
ARG PAYLOAD_EMAIL
ARG PAYLOAD_PASSWORD
ARG CMS_URL

# Make them available as environment variables during build
ENV PAYLOAD_EMAIL=$PAYLOAD_EMAIL
ENV PAYLOAD_PASSWORD=$PAYLOAD_PASSWORD
ENV CMS_URL=$CMS_URL

# Enable pnpm
RUN corepack enable

# Copy dependency files for better caching
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy all workspace package.json files (for caching)
COPY apps/website/package.json ./apps/website/package.json
# If you have other packages:
# COPY packages/*/package.json ./packages/*/package.json

# Install all dependencies
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
	pnpm install --frozen-lockfile

# Copy the full repository
COPY . .

# Build only the target workspace
RUN pnpm --filter @collectivechange/website build


# ---- Runner stage ----
FROM node:23-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

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

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 astrojs
USER astrojs

# Copy only the built output + production deps
COPY --from=builder /app/apps/website/dist ./server
COPY --from=builder /app/apps/website/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies only
RUN corepack enable && \
	pnpm install --prod --frozen-lockfile --ignore-scripts

# Expose the web port and start
EXPOSE 4321
CMD ["node", "./server/entry.mjs"]
