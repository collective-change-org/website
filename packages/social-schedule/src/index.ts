import type { CollectionSlug, Config } from 'payload'
import { publishPost } from './hooks/publish'

export type SocialScheduleConfig = {
  /**
   * List of collections to add a custom field
   */
  // collections?: Partial<Record<CollectionSlug, true>>
  metaAccessToken?: string
  mastodonAccessToken?: string
  disabled?: boolean
}

export const socialSchedule =
  (pluginOptions: SocialScheduleConfig) =>
    (config: Config): Config => {
      if (!config.collections) {
        config.collections = []
      }

      config.collections.push({
        slug: 'social-schedule-posts',
        hooks: {
          afterChange: [publishPost]
        },
        fields: [
          {
            name: 'title',
            type: 'text',
          },
          {
            name: "platforms",
            type: "group",
            fields: [
              {
                name: "instagram",
                type: "checkbox",
                admin: {
                  condition: () => {
                    return !!pluginOptions.metaAccessToken
                  }
                }
              },
              {
                name: "mastodon",
                type: "checkbox",
                admin: {
                  condition: () => {
                    return !!pluginOptions.mastodonAccessToken
                  }
                }
              },
            ],
            admin: {
              position: "sidebar",
            }
          },
          {
            name: "mediaItems",
            type: "array",
            fields: [
              {
                name: "media",
                type: "upload",
                relationTo: "social-schedule-media",
                required: true,
              },
            ],
            maxRows: 10,
          },
          {
            name: 'content',
            type: 'richText',
          },
        ],
        versions: {
          drafts: {
            schedulePublish: true,
          },
        }
      })

      config.collections.push({
        slug: 'social-schedule-media',
        upload: true,
        fields: [
          {
            name: 'alt',
            type: 'text',
            required: true,
          },
        ],
      })

      // if (pluginOptions.collections) {
      //   for (const collectionSlug in pluginOptions.collections) {
      //     const collection = config.collections.find(
      //       (collection) => collection.slug === collectionSlug,
      //     )

      //     if (collection) {
      //       collection.fields.push({
      //         name: 'addedByPlugin',
      //         type: 'text',
      //         admin: {
      //           position: 'sidebar',
      //         },
      //       })
      //     }
      //   }
      // }

      /**
       * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
       * If your plugin heavily modifies the database schema, you may want to remove this property.
       */
      if (pluginOptions.disabled) {
        return config
      }

      if (!config.endpoints) {
        config.endpoints = []
      }

      if (!config.admin) {
        config.admin = {}
      }

      if (!config.admin.components) {
        config.admin.components = {}
      }

      if (!config.admin.components.beforeDashboard) {
        config.admin.components.beforeDashboard = []
      }

      // config.admin.components.beforeDashboard.push(
      //   `social-schedule/client#BeforeDashboardClient`,
      // )
      // config.admin.components.beforeDashboard.push(
      //   `social-schedule/rsc#BeforeDashboardServer`,
      // )

      // config.endpoints.push({
      //   handler: () => {
      //     return Response.json({ message: 'Hello from custom endpoint' })
      //   },
      //   method: 'get',
      //   path: '/my-plugin-endpoint',
      // })

      const incomingOnInit = config.onInit

      config.onInit = async (payload) => {
        // Ensure we are executing any existing onInit functions before running our own.
        if (incomingOnInit) {
          await incomingOnInit(payload)
        }

        // const { totalDocs } = await payload.count({
        //   collection: 'social-schedule-posts',
        //   where: {
        //     id: {
        //       equals: 'seeded-by-plugin',
        //     },
        //   },
        // })

        // if (totalDocs === 0) {
        //   await payload.create({
        //     collection: 'social-schedule-posts',
        //     data: {
        //       id: 'seeded-by-plugin',
        //     },
        //   })
        // }
      }

      return config
    }
