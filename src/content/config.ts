import { sidebar } from "./loaders/payload/getSidebar"
import { header } from "./loaders/payload/getHeader"
import { footer } from "./loaders/payload/getFooter"
import { knowledgebase } from "./loaders/payload/pages"

export const collections = {
	docs: knowledgebase,
	sidebar,
	header,
	footer,
}
