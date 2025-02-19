import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { socialSchedule } from 'social-schedule'

import { Page, Knowledgebase } from '../payload-types'
import { getServerSideURL } from '../utilities/getURL'

const generateTitle: GenerateTitle<Knowledgebase | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Knowledgebase | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['groups'],
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  socialSchedule({
    metaAccessToken: process.env.META_ACCESS_TOKEN,
    mastodonAccessToken: process.env.MASTODON_ACCESS_TOKEN,
  })
  // payloadCloudPlugin(),
]
