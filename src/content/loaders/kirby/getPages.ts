import type { Group, SidebarEntry } from "../../config";
import { getApiUrl, getHeaders } from "./getHeaders";

export async function getPages(page: "ROOT" | string): Promise<string[]> {
	const query = {
		query: page === "ROOT" ? "site.children" : `page('${page}').children`,
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

type Page = {
	slug: string;
	title: string;
	children: Page[];
}

async function grabPages(page: string): Promise<Page[]> {
	const query = `{
  "query": "page('knowledgebase').children",
  "select": {
	"title": true,
    "slug": "page.id",
    "children": {
      "select": {
		"title": true,
        "slug": "page.id",
        "children": {
          "select": {
			"title": true,
            "slug": "page.id",
            "children": {
              "select": {
				"title": true,
                "slug": "page.id",
                "children": true
              }
            }
          }
        }
      }
    }
  }
}`

	const headers = getHeaders();
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
	const res = await fetch(getApiUrl(), {
		method: "POST",
		headers,
		body: query,
	}).catch((e) => {
		console.error("catch", e)
		throw new Error(e);
	})

	if (!res.ok) {
		console.error(res)
		throw new Error(`Failed to fetch content for page: ${page}`);
	}

	const data = await res.json();
	const children = data.result;
	// return children

	if (children.length > 0) {
		return Promise.all(
			children.map(async (child: Page) => {
				// console.log(child)
				if (!child) return
				return child
			})
		)
	}
	return []
}

export async function getGroupsAndLinks(page: string): Promise<SidebarEntry[]> {
	console.log("Getting Sidebar Groups and Links")
	const array = []
	const children = await grabPages(page);

	// If the page has children, recursively fetch the children
	if (children.length > 0) {
		for (const route of children) {
			const entry = pageToSidebarEntry(route)
			array.push(entry)
		}
	}
	// console.dir(array, { depth: Infinity })
	return array
}

function pageToSidebarEntry(page: Page): SidebarEntry {
	if (page.children.length > 0) {
		// Route is a group
		const group: Group = {
			id: page.slug,
			type: "group",
			label: page.title,
			entries: page.children.map((child) => {
				return pageToSidebarEntry(child)
			}),
			collapsed: true,
		}
		return group
	}
	// Route is a link
	return {
		id: page.slug,
		type: "link",
		label: page.title,
		href: `/${page.slug}`,
		isCurrent: false,
		attrs: {},
	}
}