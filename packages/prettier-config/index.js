module.exports = {
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	useTabs: true,
	trailingComma: 'es5',
	printWidth: 80,
	bracketSpacing: true,
	arrowParens: 'avoid',
	endOfLine: 'lf',
	plugins: [
		'prettier-plugin-astro',
		'prettier-plugin-tailwindcss',
	],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
		{
			files: ['*.json', '*.jsonc'],
			options: {
				useTabs: true,
				tabWidth: 2,
			},
		},
		{
			files: ['*.md', '*.mdx'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
