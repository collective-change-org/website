import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Aside: Block = {
  slug: 'aside',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'note',
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Tip', value: 'tip' },
        { label: 'Caution', value: 'caution' },
        { label: 'Danger', value: 'danger' },
      ],
      required: true,
    },
    {
      type: 'text',
      name: 'title',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
      required: true,
    },
  ],
}
