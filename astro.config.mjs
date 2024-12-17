import { defineConfig, envField } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			KIRBY_USERNAME: envField.string({ context: "server", access: "secret" }),
			KIRBY_PASSWORD: envField.string({ context: "server", access: "secret" }),
			KIRBY_URL: envField.string({ context: "server", access: "public" }),
		},
	},
	integrations: [
		starlight({
			title: 'Capslock 2',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			components: {
				MarkdownContent: './src/components/MarkdownContent.astro',
				PageSidebar: './src/components/PageSidebar.astro',
				Sidebar: './src/components/Sidebar.astro',
			},
			sidebar: [

			],
		}),
	],
});
