module.exports = {
	extends: [
		'eslint-config-turbo',
	].map(require.resolve),
	rules: {
		'@next/next/no-html-link-for-pages': 'off',
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	overrides: [
		{
			files: ['*.astro'],
			parser: '@astrojs/eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
		},
		{
			files: ['*.tsx', '*.jsx'],
			env: {
				browser: true,
			},
		},
	],
};
