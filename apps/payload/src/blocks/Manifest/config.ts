import type { Block } from 'payload'

export const ManifestBlock: Block = {
  slug: 'manifestBlock',
  fields: [
    {
      name: 'sections',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          required: true,
        },
        {
          name: 'listItem',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
