import { CMS_URL } from "astro:env/client"

export function createImageUrl(imageName: string): string {
	const url = new URL(CMS_URL)
	return `${url.origin}${imageName}`
}