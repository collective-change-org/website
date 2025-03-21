import type { GlobalConfig } from "payload"

import { link } from "../fields/link"
import { revalidateFooter } from "./hooks/revalidate-footer"

export const Footer: GlobalConfig = {
	slug: "footer",
	access: {
		read: () => true,
	},
	fields: [
		{
			name: "columnOne",
			type: "array",
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 6,
			admin: {
				initCollapsed: true,
			},
		},
		{
			name: "columnTwo",
			type: "array",
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 6,
			admin: {
				initCollapsed: true,
			},
		},
		{
			name: "columnThree",
			type: "array",
			fields: [
				link({
					appearances: false,
				}),
			],
			maxRows: 6,
			admin: {
				initCollapsed: true,
			},
		},
		{
			name: "socialLinks",
			type: "array",
			fields: [
				{
					name: "icon",
					type: "text",
					required: true,
					admin: {
						description: "Use Phosphor Icon names, e.g. 'mastodon-logo'—https://phosphoricons.com/",
					},
				},
				link({
					appearances: false,
					overrides: {
						// type: "custom",
					},
				}),
			],
			maxRows: 6,
			admin: {
				initCollapsed: true,
			},
		},
	],
	hooks: {
		afterChange: [revalidateFooter],
	},
}
