# Shared Packages

This directory contains shared configurations and utilities used across the monorepo.

## Available Packages

### @repo/typescript-config

Shared TypeScript configurations for different project types.

**Configurations:**
- `base.json` - Base TypeScript configuration with strict settings
- `nextjs.json` - Next.js specific configuration extending base
- `astro.json` - Astro specific configuration extending base

**Usage:**
```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    // Project-specific overrides
  }
}
```

### @repo/eslint-config

Shared ESLint configurations for different frameworks.

**Configurations:**
- `index.js` - Base ESLint configuration
- `next.js` - Next.js specific configuration
- `astro.js` - Astro specific configuration

**Usage:**
```js
import { nextJsConfig } from '@repo/eslint-config/next.js';

export default nextJsConfig;
```

### @repo/prettier-config

Shared Prettier configuration with support for Astro and TailwindCSS.

**Usage:**
```js
module.exports = {
  ...require('@repo/prettier-config'),
};
```

## Adding a New Shared Package

1. Create a new directory under `packages/`
2. Add a `package.json` with the `@repo/` namespace
3. Mark the package as `"private": true`
4. Add the package to consuming apps' `devDependencies`
5. Update this README with documentation

## Best Practices

- All shared packages should use the `@repo/` namespace
- Mark packages as private to prevent accidental publishing
- Use `workspace:*` for internal dependencies in pnpm
- Keep configurations minimal and extensible
- Document usage examples for each configuration
