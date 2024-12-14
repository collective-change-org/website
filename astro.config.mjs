import { defineConfig, envField } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			KIRBY_USERNAME: envField.string({ context: "server", access: "secret" }),
			KIRBY_PASSWORD: envField.string({ context: "server", access: "secret" }),
		},
	},
	integrations: [
		starlight({
			title: 'Capslock 2',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [

			],
		}),
	],
});
