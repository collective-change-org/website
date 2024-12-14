import { KIRBY_USERNAME, KIRBY_PASSWORD, KIRBY_URL } from "astro:env/server"

export function getHeaders() {
	const headers = new Headers();
	headers.set("Authorization", `Basic ${Buffer.from(`${KIRBY_USERNAME}:${KIRBY_PASSWORD}`).toString("base64")}`);
	return headers
}

export function getApiUrl() {
	const url = new URL(KIRBY_URL);
	const suffix = "/api/query"
	return url.origin + suffix;
}