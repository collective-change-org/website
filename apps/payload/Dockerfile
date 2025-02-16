FROM node:23-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN corepack enable pnpm && pnpm add turbo@^2.4.2
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN pnpm turbo prune @collectivechange/payload --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
RUN corepack enable pnpm && pnpm turbo run build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/payload/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/payload/.next/static ./apps/payload/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/payload/public ./apps/payload/public

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node apps/payload/server.js