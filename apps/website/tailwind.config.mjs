import starlightPlugin from "@astrojs/starlight-tailwind";
import colors, { transparent } from "tailwindcss/colors";
import corvuPlugin from "@corvu/tailwind";
import animatePlugin from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		colors: {
			"off-white": "#FFFEFA",
			transparent: "transparent",
			white: "#ffffff",
			black: "#000000",
			green: {
				black: "#001A15",
				dark: "#002922",
				lighter: "#005244",
				lightest: "#338073",
			},
			orange: {
				dark: "#EB742F",
				light: "#FF8640",
			},
			yellow: {
				neon: "#F1FF86",
				300: "#E3FF0C",
			},
			pink: {
				light: "#FCCDFF",
				dark: "#CB3DD3",
			},
			red: {
				light: "#F65917",
			},
			beige: {
				100: "#FFFBED",
			},
		},
		extend: {
			backgroundSize: {
				full: "100% 100%",
			},
			colors: {
				// Your preferred accent color. Indigo is closest to Starlight’s defaults.
				accent: colors.indigo,
				// Your preferred gray scale. Zinc is closest to Starlight’s defaults.
				gray: colors.zinc,
			},
			fontFamily: {
				// Your preferred text font. Starlight uses a system font stack by default.
				sans: [
					"Uncut",
					"Adjusted Arial Fallback",
					"Arial",
					"sans-serif",
				],
				poppins: ["Poppins", "sans-serif"],
				// Your preferred code font. Starlight uses system monospace fonts by default.
				// mono: ['"IBM Plex Mono"'],
			},
			animation: {
				expand: "expand 250ms cubic-bezier(0.32,0.72,0,0.75)",
				collapse: "collapse 250ms cubic-bezier(0.32,0.72,0,0.75)",
			},
			keyframes: {
				expand: {
					"0%": {
						height: "0px",
					},
					"100%": {
						height: "var(--corvu-disclosure-content-height)",
					},
				},
				collapse: {
					"0%": {
						height: "var(--corvu-disclosure-content-height)",
					},
					"100%": {
						height: "0px",
					},
				},
			},
		},
	},
	plugins: [starlightPlugin(), animatePlugin, corvuPlugin],
};
