import { defineConfig, envField } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			PAYLOAD_EMAIL: envField.string({ context: "server", access: "secret" }),
			PAYLOAD_PASSWORD: envField.string({ context: "server", access: "secret" }),
			CMS_URL: envField.string({ context: "server", access: "public" }),
			MOCKDATA: envField.boolean({ context: "server", access: "public", optional: true, default: false }),
			LISTMONK_API: envField.string({ context: "server", access: "public" }),
			LISTMONK_API_KEY: envField.string({ context: "server", access: "secret" })
		},
	},

	integrations: [starlight({
		title: 'Collective Change',
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
		port: 4321,
		host: true
	},
	adapter: node({
		mode: "standalone",
	}),
});