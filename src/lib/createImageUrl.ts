import { CMS_URL } from "astro:env/client";

export default function createImageUrl(url: string) {
	const cmsUrl = new URL(CMS_URL)
	return `${cmsUrl.origin}${url}`
}