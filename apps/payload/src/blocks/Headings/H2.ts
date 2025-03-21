import type { Block } from "payload"

export const H2Block: Block = {
	slug: "h2Block",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: false,
		},
	],
}
