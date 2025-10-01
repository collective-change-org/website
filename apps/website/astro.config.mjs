import { defineConfig, envField } from "astro/config"
import starlight from "@astrojs/starlight"

import solidJs from "@astrojs/solid-js"

import node from "@astrojs/node"

import icon from "astro-icon"
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			PAYLOAD_EMAIL: envField.string({
				context: "server",
				access: "secret",
			}),
			PAYLOAD_PASSWORD: envField.string({
				context: "server",
				access: "secret",
			}),
			CMS_URL: envField.string({ context: "client", access: "public" }),
		},
	},
	integrations: [
		starlight({
			title: "Collective Change",
			locales: {
				root: {
					label: "Deutsch",
					lang: "de",
				},
			},
			components: {
				Head: "./src/components/overwrites/Head.astro",
				MarkdownContent:
					"./src/components/overwrites/MarkdownContent.astro",
				PageSidebar: "./src/components/overwrites/PageSidebar.astro",
				Sidebar: "./src/components/overwrites/Sidebar/Sidebar.astro",
				Header: "./src/components/overwrites/Header.astro",
				PageFrame: "./src/components/overwrites/PageFrame.astro",
				Footer: "./src/components/overwrites/Footer.astro",
				ContentPanel: "./src/components/overwrites/ContentPanel.astro",
				PageTitle: "./src/components/overwrites/PageTitle.astro",
				TableOfContents: "./src/components/overwrites/TableOfContents.astro",
				MobileTableOfContents: "./src/components/overwrites/MobileTableOfContents.astro",
			},
			customCss: ["./src/tailwind.css"],
		}),
		solidJs({
			exclude: ["@collectivechange/payload", "/apps/payload/**/*", "**/emails/**/*"],
		}),
		icon(),
	],
	site: "https://collective-change.de",
	server: {
		port: 4321,
		host: true,
	},
	adapter: node({
		mode: "standalone",
	}),
	vite: {
		optimizeDeps: {
			exclude: ["@collectivechange/payload"],
		},
		plugins: [
			tailwindcss(),
		]
	}
})
