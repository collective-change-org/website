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
import { ColumnContainerBlock } from "./column-container"
import { IndentedContainer } from "./indented-container"

export const ContainerBlock: Block = {
	slug: "containerBlock",
	fields: [
		{
			name: "color",
			type: "select",
			required: true,
			options: [
				{ label: "Green", value: "green" },
				{ label: "White 1", value: "white-1" },
				{ label: "White 2", value: "white-2" },
			],
		},
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
				IndentedContainer,
				ButtonBlock,
				EmphasizedParagraph,
				ColumnContainerBlock,
				LargeRichTextBlock,
				UpcomingEvents,
				AccountBlock,
			],
			required: true,
			admin: {
				initCollapsed: true,
			},
		},
	],
}
