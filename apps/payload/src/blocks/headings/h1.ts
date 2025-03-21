import type { Block } from "payload"

export const H1Block: Block = {
	slug: "h1Block",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: false,
		},
	],
}
