import type { Block } from "payload"

import {
	BlocksFeature,
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical"

import { ButtonBlock } from "./button"
import { MediaBlock } from "./MediaBlock/config"

export const HeroBlock: Block = {
	slug: "heroBlock",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "richText",
			type: "richText",
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [
						...rootFeatures,
						HeadingFeature({ enabledHeadingSizes: ["h1"] }),
						BlocksFeature({ blocks: [MediaBlock, ButtonBlock] }),
						FixedToolbarFeature(),
						InlineToolbarFeature(),
						HorizontalRuleFeature(),
					]
				},
			}),
			label: false,
			required: true,
		},
	],
}
