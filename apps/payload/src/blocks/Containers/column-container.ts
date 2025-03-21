import type { Block } from "payload"

import { AccountBlock } from "../account"
import { ButtonBlock } from "../button"
import { EmphasizedParagraph } from "../emphasized-paragraph"
import { H1Block } from "../headings/h1"
import { H2Block } from "../headings/h2"
import { HeroBlock } from "../hero"
import { LoginBlock } from "../login"
import { ManifestBlock } from "../manifest/config"
import { MediaBlock } from "../MediaBlock/config"
import { LargeRichTextBlock } from "../RichText/large-rich-text-block"
import { SignupBlock } from "../sign-up"
import { UpcomingEvents } from "../upcoming-events"

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
