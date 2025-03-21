import type { Block } from "payload"

import {
	FixedToolbarFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical"

export const LargeRichTextBlock: Block = {
	slug: "largeRichTextBlock",
	fields: [
		{
			name: "title",
			type: "text",
		},
		{
			name: "richText",
			type: "richText",
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
				},
			}),
			required: true,
			label: false,
		},
	],
}
