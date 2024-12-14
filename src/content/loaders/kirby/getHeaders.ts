import { KIRBY_USERNAME, KIRBY_PASSWORD } from "astro:env/server"

export function getHeaders() {
	const headers = new Headers();
	headers.set("Authorization", `Basic ${Buffer.from(`${KIRBY_USERNAME}:${KIRBY_PASSWORD}`).toString("base64")}`);
	return headers
}