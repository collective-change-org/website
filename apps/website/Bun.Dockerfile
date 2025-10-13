FROM oven/bun:1.3 AS base

FROM base AS pruner
WORKDIR /app
RUN bun install turbo@^2.5.8
COPY . .
RUN bun run turbo prune @collectivechange/website --docker

FROM base AS installer
WORKDIR /app
# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/json/ ./
RUN ls -l
# First install the dependencies (as they change less often)
# RUN bun install --production
RUN bun install

FROM base AS builder
WORKDIR /app
# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .
# COPY --from=pruner /app/out/json/apps/website/package.json .
COPY --from=pruner /app/out/json/bun.lock .
# Copy installed dependencies
COPY --from=installer /app/node_modules ./node_modules
COPY tsconfig.base.jsonc turbo.json ./
# # Install any remaining dependencies (including devDependencies needed for build)
# RUN bun install --frozen-lockfile
RUN bun install

# Accept build arguments
ARG PAYLOAD_EMAIL
ARG PAYLOAD_PASSWORD
ARG CMS_URL

# Make them available as environment variables during build
ENV PAYLOAD_EMAIL=$PAYLOAD_EMAIL
ENV PAYLOAD_PASSWORD=$PAYLOAD_PASSWORD
ENV CMS_URL=$CMS_URL

# Build the project
RUN bun run turbo build --filter @collectivechange/website

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PAYLOAD_EMAIL=$PAYLOAD_EMAIL
ENV PAYLOAD_PASSWORD=$PAYLOAD_PASSWORD
ENV CMS_URL=$CMS_URL
ENV HOST=0.0.0.0
ENV PORT=4321

# Create nextjs user
RUN adduser --system --uid 1001 astro

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Switch to non-root user
USER astrojs

# Expose the web port and start
EXPOSE 4321
CMD ["bun", "./dist/server/entry.mjs"]
