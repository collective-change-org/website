import type { Block } from "payload"

import {
	FixedToolbarFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical"

export const PlainRichTextBlock: Block = {
	slug: "plainRichTextBlock",
	fields: [
		{
			name: "richText",
			type: "richText",
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [
						...rootFeatures,
						FixedToolbarFeature(),
						InlineToolbarFeature(),
					]
				},
			}),
			required: true,
			label: false,
		},
	],
}
