FROM oven/bun:1.3 AS base

FROM base AS pruner
WORKDIR /app
RUN bun install turbo@^2.5.8
COPY . .
RUN bun run turbo prune @collectivechange/payload --docker

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
# COPY --from=pruner /app/out/json/package.json .
COPY --from=pruner /app/out/json/bun.lock .
# Copy installed dependencies
COPY --from=installer /app/node_modules ./node_modules
# # Install any remaining dependencies (including devDependencies needed for build)
RUN bun install

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the project
RUN bun run turbo build

FROM base AS runner
WORKDIR /app
# RUN bun install --omit dev

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create nextjs user
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder --chown=nextjs:bun /app/apps/payload/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/apps/payload/.next/static ./.next/static
COPY --from=builder --chown=nextjs:bun /app/apps/payload/public ./public

# Debug: Check what's in the builder stage
RUN echo "=== Checking builder stage structure ==="
COPY --from=builder /app /tmp/debug_builder
RUN ls -la /tmp/debug_builder
RUN ls -la /tmp/debug_builder/node_modules || echo "No node_modules in builder"
RUN ls -la /tmp/debug_builder/.bun || echo "No .bun in builder"

# Copy complete node_modules structure from builder to preserve all dependencies
COPY --from=builder --chown=nextjs:bun /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
