import { getApiUrl, getHeaders } from "./getHeaders";

export async function getPages(page: string): Promise<string[]> {
	const query = {
		query: `page('${page}').children`,
	};

	const headers = getHeaders();
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
	const res = await fetch(getApiUrl(), {
		method: "POST",
		headers,
		body: JSON.stringify(query),
	}).catch((e) => {
		console.error("catch", e)
		throw new Error(e);
	})

	if (!res.ok) {
		console.error(res)
		throw new Error(`Failed to fetch content for page: ${page}`);
	}

	const data = await res.json();
	const children = data.result as string[];

	// If the page has children, recursively fetch the children
	if (children.length > 0) {
		const childContent = await Promise.all(
			children.map(async (child) => {
				return getPages(child);
			})
		);

		return childContent.flat();
	}

	return [page];
}