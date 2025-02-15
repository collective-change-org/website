import type { Block } from 'payload'
import { ContainerLayoutField } from './ContainerLayoutField'
import { H1Block } from '../Headings/H1'
import { H2Block } from '../Headings/H2'
import { HeroBlock } from '../Hero'
import { LoginBlock } from '../Login'
import { ManifestBlock } from '../Manifest/config'
import { MediaBlock } from '../MediaBlock/config'
import { SignupBlock } from '../Signup'
import { ButtonBlock } from '../Button'
import { EmphasizedParagraph } from '../EmphasizedParagraph'
import { LargeRichTextBlock } from '../RichText/LargeRichTextBlock'
import { UpcomingEvents } from '../UpcomingEvents'
import { AccountBlock } from '../Account'

export const IndentedContainer: Block = {
  slug: 'indentedContainer',
  fields: [
    {
      name: 'layout',
      type: 'blocks',
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
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
