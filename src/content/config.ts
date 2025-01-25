import { sidebar } from "./loaders/payload/getSidebar"
import { header } from "./loaders/payload/getHeader"
import { footer } from "./loaders/payload/getFooter"
import { knowledgebase } from "./loaders/payload/pages"
import { events } from "./loaders/payload/pages/getEvents"

export const collections = {
	docs: knowledgebase,
	sidebar,
	header,
	footer,
	events,
}
