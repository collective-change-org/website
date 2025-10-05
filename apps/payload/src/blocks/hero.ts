import type { Block } from "payload"

export const HeroBlock: Block = {
	slug: "heroBlock",
	imageURL: "/blocks/hero.png",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
	],
	admin: {
		disableBlockName: true,
	},
}
