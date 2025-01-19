import starlightPlugin from '@astrojs/starlight-tailwind';
import colors, { transparent } from 'tailwindcss/colors';
import corvuPlugin from '@corvu/tailwind'
import animatePlugin from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			'off-white': '#FFFEFA',
			transparent: 'transparent',
			white: '#ffffff',
			black: '#000000',
			green: {
				black: '#001A15',
				dark: '#002922',
				lighter: '#338073',
			},
			orange: {
				dark: '#EB742F',
				light: '#FF8640',
			},
			yellow: {
				neon: '#F1FF86',
			},
			pink: {
				light: '#FCCDFF',
			}
		},
		extend: {
			colors: {
				// Your preferred accent color. Indigo is closest to Starlight’s defaults.
				accent: colors.indigo,
				// Your preferred gray scale. Zinc is closest to Starlight’s defaults.
				gray: colors.zinc,
			},
			fontFamily: {
				// Your preferred text font. Starlight uses a system font stack by default.
				sans: ['Uncut'],
				poppins: ['Poppins', 'sans-serif']
				// Your preferred code font. Starlight uses system monospace fonts by default.
				// mono: ['"IBM Plex Mono"'],
			},
		},
	},
	plugins: [starlightPlugin(), animatePlugin, corvuPlugin],
}
