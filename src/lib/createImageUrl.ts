import { CMS_URL } from "astro:env/client"

export function createImageUrl(imageName: string): string {
	const url = new URL(CMS_URL)
	console.log("IMAGEURL:")
	console.log(url)
	// return `http://localhost:3000${imageName}`;
	return `${url.origin}${imageName}`
}