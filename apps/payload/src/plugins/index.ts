import type { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types"
import type { Plugin } from "payload"

import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs"
import { seoPlugin } from "@payloadcms/plugin-seo"

import type { Knowledgebase, Page } from "../payload-types"

import { getServerSideURL } from "../utilities/getURL"

const generateTitle: GenerateTitle<Knowledgebase | Page> = ({ doc }) => {
	return doc?.title ? `${doc.title} | Payload Website Template` : "Payload Website Template"
}

const generateURL: GenerateURL<Knowledgebase | Page> = ({ doc }) => {
	const url = getServerSideURL()

	return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
	nestedDocsPlugin({
		collections: ["groups"],
	}),
	seoPlugin({
		generateTitle,
		generateURL,
	}),
	// payloadCloudPlugin(),
]
