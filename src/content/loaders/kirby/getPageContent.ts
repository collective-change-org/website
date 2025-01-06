import type { KnowledgebasePage } from "../../config";
import { generateToC, headingToSlug } from "./generateToC";
import { getApiUrl, getHeaders } from "./getHeaders";

export async function getPageContent(page: string, order: number): Promise<KnowledgebasePage> {
	const query = {
		query: `page('${page}')`,
		select: {
			title: true,
			blocks: true,
		},
	};

	const headers = getHeaders();

	const res = await fetch(getApiUrl(), {
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


	// Generate ToC
	const headings = blocks.filter(({ type }: { type: string }) => type === "heading");
	// Kirby Headings to Astro Headings
	const astroHeadings = headings.map(({ content }: {
		content: {
			level: string;
			text: string;
		};
	}) => {
		const depth = parseInt(content.level.replace("h", ""));
		return {
			depth,
			slug: headingToSlug(content.text),
			text: content.text,
		};
	});

	const items = generateToC(astroHeadings, {
		minHeadingLevel: 2,
		maxHeadingLevel: 3,
		title: data.result.title,
	});

	return {
		id: page === "home" ? "/" : page,
		title: data.result.title,
		template: page.includes("knowledgebase") ? "doc" : "splash",
		blocks,
		sidebar: {
			order,
		},
		tableOfContents: { items }
	};
}