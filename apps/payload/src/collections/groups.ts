import type { CollectionConfig } from "payload"

import { anyone } from "../access/anyone"
import { authenticated } from "../access/authenticated"
import { slugField } from "../fields/slug"

export const Groups: CollectionConfig = {
	slug: "groups",
	access: {
		create: authenticated,
		delete: authenticated,
		read: anyone,
		update: authenticated,
	},
	admin: {
		useAsTitle: "title",
	},
	defaultPopulate: {
		title: true,
		slug: true,
		breadcrumbs: true,
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		...slugField(),
		{
			name: "docOrder",
			label: "Document Order",
			type: "number",
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "badgeText",
			label: "Badge Text",
			type: "text",
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "badgeVariant",
			label: "Badge Variant",
			type: "select",
			defaultValue: "default",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Note", value: "note" },
				{ label: "Danger", value: "danger" },
				{ label: "Success", value: "success" },
				{ label: "Caution", value: "caution" },
				{ label: "Tip", value: "tip" },
			],
			required: true,
			admin: {
				position: "sidebar",
			},
		},
	],
}
