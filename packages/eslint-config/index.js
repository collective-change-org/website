module.exports = {
	extends: ['eslint-config-turbo'],
	rules: {
		'@next/next/no-html-link-for-pages': 'off',
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
};
