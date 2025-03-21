import type { Block } from "payload"

export const LinkCardBlock: Block = {
	slug: "linkCardBlock",
	interfaceName: "LinkCardBlock",

	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "href",
			type: "text",
			required: true,
		},
		{
			name: "description",
			type: "textarea",
		},
	],
}
