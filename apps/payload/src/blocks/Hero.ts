import {
  lexicalEditor,
  HeadingFeature,
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { MediaBlock } from './MediaBlock/config'
import { ButtonBlock } from './Button'

export const HeroBlock: Block = {
  slug: 'heroBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1'] }),
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
