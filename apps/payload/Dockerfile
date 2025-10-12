FROM oven/bun:1.1.29-alpine AS base

FROM base AS pruner
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN bun install turbo@^2.4.2
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN bun run turbo prune @collectivechange/payload --docker

FROM base AS deps
WORKDIR /app
# Install dependencies
COPY --from=pruner /app/out/json/package.json /app/out/json/bun.lock ./
RUN bun install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run turbo build
# Production image, copy all the files and run next

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:bun .next
COPY --from=builder --chown=nextjs:bun /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["bun", "server.js"]

# OLD RUNNER vvv
# FROM base AS runner
# WORKDIR /app

# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/apps/payload/.next/standalone ./
# COPY --from=installer --chown=nextjs:nodejs /app/apps/payload/.next/static ./apps/payload/.next/static
# # COPY --from=installer --chown=nextjs:nodejs /app/apps/payload/public ./apps/payload/public

# ENV PORT 3000

# CMD HOSTNAME="0.0.0.0" node apps/payload/server.js
# OLD RUNNER ^^^
