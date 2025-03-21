import antfu from "@antfu/eslint-config"
import nextPlugin from "@next/eslint-plugin-next"

export default antfu({
	type: "app",
	typescript: true,
	formatters: true,
	react: true,
	stylistic: {
		indent: "tab",
		quotes: "double",
	},
	ignores: [
		"**/payload-types.ts",
		"**/importMap.js",
		"**/migrations/*",
		"**/node_modules/*",
	],
}, {
	rules: {
		"ts/consistent-type-definitions": ["error", "type"],
		"no-console": ["warn"],
		"antfu/no-top-level-await": ["off"],
		"node/prefer-global/process": ["off"],
		"node/prefer-global/buffer": ["off"],
		"perfectionist/sort-imports": ["error", {
			tsconfigRootDir: ".",
		}],
		"unicorn/filename-case": ["error", {
			case: "kebabCase",
			ignore: ["README.md"],
		}],
	},
}, {
	plugins: {
		"@next/next": nextPlugin,
	},
	rules: {
		...nextPlugin.configs.recommended.rules,
		...nextPlugin.configs["core-web-vitals"].rules,
	},
})
// import { dirname } from 'path'
// import { fileURLToPath } from 'url'
// import { FlatCompat } from '@eslint/eslintrc'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// })

// const eslintConfig = [
//   ...compat.extends('next/core-web-vitals', 'next/typescript'),
//   {
//     rules: {
//       '@typescript-eslint/ban-ts-comment': 'warn',
//       '@typescript-eslint/no-empty-object-type': 'warn',
//       '@typescript-eslint/no-explicit-any': 'warn',
//       '@typescript-eslint/no-unused-vars': [
//         'warn',
//         {
//           vars: 'all',
//           args: 'after-used',
//           ignoreRestSiblings: false,
//           argsIgnorePattern: '^_',
//           varsIgnorePattern: '^_',
//           destructuredArrayIgnorePattern: '^_',
//           caughtErrorsIgnorePattern: '^(_|ignore)',
//         },
//       ],
//     },
//   },
// ]

// export default eslintConfig
