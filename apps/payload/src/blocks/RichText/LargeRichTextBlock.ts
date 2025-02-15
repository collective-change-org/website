import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const LargeRichTextBlock: Block = {
  slug: 'largeRichTextBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'richText',
      type: 'richText',
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
