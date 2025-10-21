# Collective Change Monorepo

A modern for the Collective Change website built with [Turborepo](https://turbo.build/repo), featuring a website and CMS applications with shared configurations.

## Project Structure

```
capslock/
├── apps/
│   ├── payload/          # Payload CMS (Next.js)
│   └── website/          # Main website (Astro)
├── packages/
│   ├── eslint-config/    # Shared ESLint configurations
│   ├── prettier-config/  # Shared Prettier configuration
│   └── typescript-config/# Shared TypeScript configurations
├── turbo.json           # Turborepo pipeline configuration
├── package.json         # Root workspace configuration
└── pnpm-workspace.yaml  # pnpm workspace configuration
```

## Applications

### Website (`apps/website`)
- **Framework**: Astro with Solid.js
- **Purpose**: Main marketing and documentation website
- **Features**: Starlight docs, TailwindCSS, TypeScript

### Payload CMS (`apps/payload`)
- **Framework**: Next.js with Payload CMS
- **Purpose**: Content management system
- **Features**: PostgreSQL, Email, Live Preview, SEO plugin

## Shared Packages

### @repo/typescript-config
Centralized TypeScript configurations:
- `base.json` - Common TypeScript settings
- `nextjs.json` - Next.js specific configuration
- `astro.json` - Astro specific configuration

### @repo/eslint-config
Shared ESLint configurations:
- Base ESLint rules with Turborepo integration
- Framework-specific configurations for Next.js and Astro

### @repo/prettier-config
Unified code formatting with support for:
- Astro files
- TailwindCSS class sorting
- Consistent formatting across the monorepo

## Getting Started

### Prerequisites
- Node.js 18.20.2+ or 20.9.0+
- pnpm 10.4.1

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all applications
pnpm build
```

## Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev          # Start all apps in development mode
pnpm build        # Build all applications
pnpm preview      # Preview built applications

# Code Quality
pnpm lint         # Lint all packages
pnpm check-types  # Type check all packages
pnpm format       # Format code with Prettier
pnpm test         # Run tests across all packages

# Utilities
pnpm clean        # Clean build artifacts
```

### Individual App Commands

```bash
# Run commands in specific apps
pnpm --filter @collectivechange/website dev
pnpm --filter @collectivechange/payload build
```

## Turborepo Pipeline

The monorepo uses Turborepo for optimized task execution with intelligent caching:

- **Parallel Execution**: Tasks run in parallel where possible
- **Dependency Awareness**: Tasks respect inter-package dependencies
- **Remote Caching**: Speeds up CI/CD and team collaboration
- **Incremental Builds**: Only rebuilds what's changed

### Task Dependencies

```
build → check-types
dev ← (no dependencies, runs in parallel)
lint → (runs independently)
test → build
```

## Environment Variables

### Payload CMS
- `PAYLOAD_SECRET` - Secret for Payload CMS
- `DATABASE_URI` - PostgreSQL connection string
- `CMS_URL` - CMS base URL
- `PAYLOAD_EMAIL` - Admin email
- `PAYLOAD_PASSWORD` - Admin password

### Development
- `NODE_ENV` - Environment mode

## Architecture Decisions

### Monorepo Benefits
- **Code Sharing**: Shared configurations and utilities
- **Atomic Changes**: Deploy related changes together
- **Simplified Dependencies**: Centralized dependency management
- **Consistent Tooling**: Unified linting, formatting, and type checking

### Technology Choices
- **Turborepo**: Fast, scalable build system
- **pnpm**: Efficient package manager with workspace support
- **TypeScript**: Type safety across all packages
- **ESLint + Prettier**: Consistent code quality and formatting

## Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/new-feature`
2. **Make Changes**: Edit code in relevant apps/packages
3. **Run Checks**: `pnpm lint && pnpm check-types`
4. **Test Changes**: `pnpm test`
5. **Format Code**: `pnpm format`
6. **Commit Changes**: Follow conventional commit format
7. **Create PR**: Submit for review

## Adding New Packages

1. Create directory under `apps/` or `packages/`
2. Add `package.json` with appropriate namespace:
   - Apps: `@collectivechange/app-name`
   - Packages: `@repo/package-name`
3. Update workspace configuration if needed
4. Add to Turborepo pipeline in `turbo.json`
5. Document in this README

## Deployment

Each application can be deployed independently:

- **Website**: Static site deployment (Vercel, Netlify, etc.)
- **Payload CMS**: Node.js deployment with PostgreSQL

## Contributing

1. Ensure all tests pass: `pnpm test`
2. Lint and format code: `pnpm lint && pnpm format`
3. Type check: `pnpm check-types`
4. Follow conventional commit messages
5. Update documentation as needed

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Astro Documentation](https://docs.astro.build)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
