import type { Metadata } from "next"

import type { Config, Knowledgebase, Media, Page } from "../payload-types"

import { getServerSideURL } from "./get-url"
import { mergeOpenGraph } from "./merge-open-graph"

function getImageURL(image?: Media | Config["db"]["defaultIDType"] | null) {
	const serverUrl = getServerSideURL()

	let url = `${serverUrl}/website-template-OG.webp`

	if (image && typeof image === "object" && "url" in image) {
		const ogUrl = image.sizes?.og?.url

		url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
	}

	return url
}

export async function generateMeta(args: {
	doc: Partial<Page> | Partial<Knowledgebase>
}): Promise<Metadata> {
	const { doc } = args || {}

	const ogImage = getImageURL(doc?.meta?.image)

	const title = doc?.meta?.title
		? `${doc?.meta?.title} | Payload Website Template`
		: "Payload Website Template"

	return {
		description: doc?.meta?.description,
		openGraph: mergeOpenGraph({
			description: doc?.meta?.description || "",
			images: ogImage
				? [
						{
							url: ogImage,
						},
					]
				: undefined,
			title,
			url: Array.isArray(doc?.slug) ? doc?.slug.join("/") : "/",
		}),
		title,
	}
}
