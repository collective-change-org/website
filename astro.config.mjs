import { defineConfig, envField } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			KIRBY_USERNAME: envField.string({ context: "server", access: "secret" }),
			KIRBY_PASSWORD: envField.string({ context: "server", access: "secret" }),
			KIRBY_URL: envField.string({ context: "server", access: "public" }),
			MOCKDATA: envField.boolean({ context: "server", access: "public", optional: true, default: false }),
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
			customCss: ["./src/tailwind.css"]
		}),
		tailwind({
			applyBaseStyles: false,
		})],
	site: 'https://changecollective.woven.design',
	server: {
		port: 3000,
		host: true
	}
});