import { defineConfig, envField } from "astro/config"
import starlight from "@astrojs/starlight"

import tailwind from "@astrojs/tailwind"

import solidJs from "@astrojs/solid-js"

import node from "@astrojs/node"

import icon from "astro-icon"

import { loadEnv } from 'payload/node'

loadEnv()

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
					label: "English",
					lang: "de",
				},
			},
			social: {
				github: "https://github.com/withastro/starlight",
			},
			components: {
				Head: "./src/components/overwrites/Head.astro",
				MarkdownContent:
					"./src/components/overwrites/MarkdownContent.astro",
				PageSidebar: "./src/components/overwrites/PageSidebar.astro",
				Sidebar: "./src/components/overwrites/Sidebar.astro",
				Header: "./src/components/overwrites/Header.astro",
				PageFrame: "./src/components/overwrites/PageFrame.astro",
				Footer: "./src/components/overwrites/Footer.astro",
				ContentPanel: "./src/components/overwrites/ContentPanel.astro",
				PageTitle: "./src/components/overwrites/PageTitle.astro",
			},
			customCss: ["./src/tailwind.css"],
		}),
		tailwind({
			applyBaseStyles: false,
		}),
		solidJs({
			exclude: ["@collectivechange/payload", "../payload/*"],
		}),
		icon(),
	],
	site: "https://changecollective.woven.design",
	experimental: {
		svg: true,
	},
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
	}
})
