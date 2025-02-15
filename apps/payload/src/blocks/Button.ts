import { link } from '@/fields/link'
import type { Block } from 'payload'

export const ButtonBlock: Block = {
  slug: 'buttonBlock',
  fields: [
    link({
      appearances: false,
    }),
    {
      name: 'hasLeftIcon',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'iconLeft',
      type: 'text',
      required: false,
      admin: {
        condition: (_, { hasLeftIcon }) => hasLeftIcon,
      },
    },
    {
      name: 'hasRightIcon',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'iconRight',
      type: 'text',
      required: false,
      admin: {
        condition: (_, { hasRightIcon }) => hasRightIcon,
      },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'green',
      options: [
        { label: 'Green', value: 'green' },
        { label: 'Orange', value: 'orange' },
        { label: 'Black', value: 'black' },
      ],
      required: true,
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'small',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Large', value: 'large' },
      ],
      required: true,
    },
  ],
}
