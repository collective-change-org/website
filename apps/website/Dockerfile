FROM node:23-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN corepack enable pnpm && pnpm add turbo@^2

# Copy root workspace files
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN pnpm turbo prune @collectivechange/website --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Accept build arguments
ARG PAYLOAD_EMAIL
ARG PAYLOAD_PASSWORD
ARG CMS_URL

# Make them available as environment variables during build
ENV PAYLOAD_EMAIL=$PAYLOAD_EMAIL
ENV PAYLOAD_PASSWORD=$PAYLOAD_PASSWORD
ENV CMS_URL=$CMS_URL

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
RUN corepack enable pnpm && pnpm turbo run build --filter=@collectivechange/website

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astrojs
USER astrojs

# Automatically leverage output traces to reduce image size
COPY --from=installer --chown=astrojs:nodejs /app/apps/website/dist ./
# COPY --from=installer --chown=astrojs:nodejs /app/apps/website/public ./apps/website/public

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["node", "./server/entry.mjs"]
