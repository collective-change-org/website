import type { Block } from "payload"

export const Badge: Block = {
	slug: "badge",
	fields: [
		{
			name: "text",
			type: "text",
		},
		{
			name: "variant",
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
		},
		{
			name: "size",
			type: "select",
			defaultValue: "small",
			options: [
				{ label: "Small", value: "small" },
				{ label: "Medium", value: "medium" },
				{ label: "Large", value: "Large" },
			],
			required: true,
		},
	],
}
