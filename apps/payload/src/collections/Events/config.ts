import { authenticated } from '../../access/authenticated'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

const richTextConfig = lexicalEditor({
  features: ({ rootFeatures }) => {
    return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
  },
})

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      editor: richTextConfig,
    },
    {
      type: 'collapsible',
      label: 'Event Details',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'beginDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'd.M.yyy HH:mm',
                  timeFormat: 'HH:mm',
                },
                width: '50%',
              },
              required: true,
            },
            {
              name: 'endDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'd.M.yyy HH:mm',
                  timeFormat: 'HH:mm',
                },
                width: '50%',
              },
              validate: (value, context) => {
                if (!value) {
                  return 'End date is required'
                }
                const siblingData = context.siblingData as { beginDate: Date }
                if (!siblingData.beginDate) {
                  return 'Begin date is required'
                }
                if (value < siblingData.beginDate) {
                  return 'End date must be after begin date'
                }
                return true
              },
              required: true,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'left',
              type: 'richText',
              editor: richTextConfig,
            },
            {
              name: 'right',
              type: 'richText',
              editor: richTextConfig,
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'attendees',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 500, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
  endpoints: [
    {
      method: 'put',
      path: '/:id/attend',
      handler: async (req) => {
        const eventId = req.routeParams?.id as string | undefined
        if (!eventId) {
          req.payload.logger.error('User Attending Event: Event ID is required')
          return new Response('Event ID is required', { status: 400 })
        }
        const user = req.user
        if (!user) {
          req.payload.logger.error('User Attending Event: Unauthorized')
          return new Response('Unauthorized', { status: 401 })
        }

        const event = await req.payload.findByID({
          collection: 'events',
          id: eventId,
        })
        if (!event) {
          req.payload.logger.error('User Attending Event: Event not found')
          return new Response('Event not found', { status: 404 })
        }

        const attendees = event.attendees || []
        if (
          attendees.some((attendee) => {
            if (typeof attendee === 'number') {
              return attendee === user.id
            }
            return attendee.id === user.id
          })
        ) {
          req.payload.logger.error('User Attending Event: User already attending')
          return new Response('Already attending', { status: 409 })
        }

        attendees.push(user.id)
        await req.payload.update({
          collection: 'events',
          id: eventId,
          data: {
            attendees,
          },
        })
        return new Response('Attending', { status: 200 })
      },
    },
    {
      method: 'delete',
      path: '/:id/attend',
      handler: async (req) => {
        const eventId = req.routeParams?.id as string | undefined
        if (!eventId) {
          req.payload.logger.error('User Canceling Attending Event: Event ID is required')
          return new Response('Event ID is required', { status: 400 })
        }
        const user = req.user
        if (!user) {
          req.payload.logger.error('User Canceling Attending Event: Unauthorized')
          return new Response('Unauthorized', { status: 401 })
        }

        const event = await req.payload.findByID({
          collection: 'events',
          id: eventId,
        })
        if (!event) {
          req.payload.logger.error('User Canceling Attending Event: Event not found')
          return new Response('Event not found', { status: 404 })
        }
        console.dir(event, {
          depth: Infinity
        })

        const attendees = event.attendees || []
        const index = attendees.findIndex((attendee) => {
          if (typeof attendee === 'number') {
            return attendee === user.id
          }
          return attendee.id === user.id
        })
        if (index === -1) {
          req.payload.logger.error('User Canceling Attending Event: User not attending to begin with')
          return new Response('Not attending', { status: 409 })
        }

        attendees.splice(index, 1)
        await req.payload.update({
          collection: 'events',
          id: eventId,
          data: {
            attendees,
          },
        })
        return new Response('Not attending', { status: 200 })
      },
    },
  ],
}
