import type { Block } from "payload"

import { link } from "@/fields/link"

export const SelectedWorkBlock: Block = {
	slug: "selectedWorkBlock",
	imageURL: "/blocks/selected-work.png",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: "Headline",
		},
		{
			name: "thumbnail",
			type: "upload",
			relationTo: "media",
			required: true,
			label: "Thumbnail",
		},
		{
			name: "articleTitle",
			type: "text",
			required: true,
		},
		{
			name: "articleExcerpt",
			type: "textarea",
			required: true,
		},
		link({
			appearances: false,
			disableLabel: true,
		}),
	],
	admin: {
		disableBlockName: true,
	},
}
