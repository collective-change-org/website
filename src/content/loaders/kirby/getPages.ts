import type { SidebarEntry } from "../../config";
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

async function grabPages(page: string) {
	const query = `{
  "query": "page('knowledgebase').children",
  "select": {
    "guid": "page.id",
    "children": {
      "select": {
        "guid": "page.id",
        "children": {
          "select": {
            "guid": "page.id",
            "children": {
              "select": {
                "guid": "page.id",
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
	const children = data.result as string[];
	// return children

	if (children.length > 0) {
		return Promise.all(
			children.map(async (child) => {
				console.log(child)
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
		const childContent = await Promise.all(
			children.map(async (child) => {
				if (!child) return
			})
		);
	}
	return []
}