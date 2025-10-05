import type { Block } from "payload"

import { Button } from "@/fields/button"

export const JoinCrewBlock: Block = {
	slug: "joinCrewBlock",
	imageURL: "/blocks/join-crew.png",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			label: "Headline",
		},
		{
			name: "text",
			type: "textarea",
			required: true,
		},
		Button,
	],
	admin: {
		disableBlockName: true,
	},
}
