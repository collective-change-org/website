import { defineConfig, envField } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			KIRBY_USERNAME: envField.string({ context: "server", access: "secret" }),
			KIRBY_PASSWORD: envField.string({ context: "server", access: "secret" }),
			KIRBY_URL: envField.string({ context: "server", access: "public" }),
			MOCKDATA: envField.boolean({ context: "server", access: "public", optional: true, default: false }),
			LISTMONK_API: envField.string({ context: "client", access: "public" }),
			LISTMONK_API_KEY: envField.string({ context: "client", access: "public" })
		},
	},
	integrations: [starlight({
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
	}), tailwind({
		applyBaseStyles: false,
	}), solidJs()],
	site: 'https://changecollective.woven.design',
	server: {
		port: 3000,
		host: true
	}
});