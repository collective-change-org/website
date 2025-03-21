import type { Block } from "payload"

import { AccountBlock } from "../Account"
import { ButtonBlock } from "../Button"
import { EmphasizedParagraph } from "../EmphasizedParagraph"
import { H1Block } from "../Headings/H1"
import { H2Block } from "../Headings/H2"
import { HeroBlock } from "../Hero"
import { LoginBlock } from "../Login"
import { ManifestBlock } from "../Manifest/config"
import { MediaBlock } from "../MediaBlock/config"
import { LargeRichTextBlock } from "../RichText/LargeRichTextBlock"
import { SignupBlock } from "../Signup"
import { UpcomingEvents } from "../UpcomingEvents"

export const ColumnContainerBlock: Block = {
	slug: "columnContainerBlock",
	fields: [
		{
			name: "columns",
			type: "array",
			fields: [
				{
					name: "layout",
					type: "blocks",
					blocks: [
						H1Block,
						H2Block,
						HeroBlock,
						MediaBlock,
						LoginBlock,
						SignupBlock,
						ManifestBlock,
						ButtonBlock,
						EmphasizedParagraph,
						LargeRichTextBlock,
						UpcomingEvents,
						AccountBlock,
					],
					required: true,
					label: false,
					admin: {
						initCollapsed: true,
					},
				},
			],
		},
	],
}
