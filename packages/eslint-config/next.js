module.exports = {
	extends: [
		'eslint-config-turbo',
		'eslint-config-next',
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
	settings: {
		react: {
			version: 'detect',
		},
	},
};
