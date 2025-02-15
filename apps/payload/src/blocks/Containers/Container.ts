import type { Block } from 'payload'
import { ContainerLayoutField } from './ContainerLayoutField'
import { H1Block } from '../Headings/H1'
import { H2Block } from '../Headings/H2'
import { HeroBlock } from '../Hero'
import { LoginBlock } from '../Login'
import { ManifestBlock } from '../Manifest/config'
import { MediaBlock } from '../MediaBlock/config'
import { SignupBlock } from '../Signup'
import { IndentedContainer } from './IndentedContainer'
import { ButtonBlock } from '../Button'
import { EmphasizedParagraph } from '../EmphasizedParagraph'
import { ColumnContainerBlock } from './ColumnContainer'
import { LargeRichTextBlock } from '../RichText/LargeRichTextBlock'
import { UpcomingEvents } from '../UpcomingEvents'
import { AccountBlock } from '../Account'

export const ContainerBlock: Block = {
  slug: 'containerBlock',
  fields: [
    {
      name: 'color',
      type: 'select',
      required: true,
      options: [
        { label: 'Green', value: 'green' },
        { label: 'White 1', value: 'white-1' },
        { label: 'White 2', value: 'white-2' },
      ],
    },
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
