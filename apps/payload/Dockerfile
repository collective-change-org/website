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
RUN bun install --production

FROM base AS builder
WORKDIR /app
# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/json/apps/payload/package.json .
COPY --from=pruner /app/out/json/bun.lock .
# Copy installed dependencies
COPY --from=installer /app/node_modules ./node_modules
# # Install any remaining dependencies (including devDependencies needed for build)
# RUN bun install --frozen-lockfile

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the project
RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create nextjs user
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder --chown=nextjs:bun /app/apps/payload/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/apps/payload/.next/static ./apps/payload/.next/static
COPY --from=builder --chown=nextjs:bun /app/apps/payload/public ./apps/payload/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "apps/payload/server.js"]
