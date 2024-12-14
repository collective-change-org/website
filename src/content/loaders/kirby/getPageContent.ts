// {
// 	"query": "page('knowledgebase/software/photoshop')",
// 	"select": {
// 	  "url": true,
// 	  "title": true,
// 	  "text": true
// 	  }
//   }

import type { KnowledgebasePage } from "../../config";
import { getHeaders } from "./getHeaders";

const api = "https://eric.test/api/query";

export async function getPageContent(page: string): Promise<KnowledgebasePage> {
	const query = {
		query: `page('${page}')`,
		select: {
			title: true,
			blocks: true,
		},
	};

	const headers = getHeaders();

	const res = await fetch(api, {
		method: "POST",
		headers,
		body: JSON.stringify(query),
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch content for page: ${page}`);
	}

	const data = await res.json();
	let blocks = []

	try {
		blocks = JSON.parse(data.result.blocks || "[]")
	} catch (e) {
		console.error(e)
	}

	return { id: page, title: data.result.title, blocks };
}