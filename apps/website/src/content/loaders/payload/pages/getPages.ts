import type { LexicalRootContainer } from "../schemas/lexical"
import type { Page } from "."
import { getPayload } from "payload"
import { config } from "@collectivechange/payload"

export type ContentBlock = {
  id: string
  columns: Array<{
    size: number
    richText: LexicalRootContainer
  }>
}

export async function getPages(): Promise<Page[]> {
  return []
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: "pages",
  })

  try {

    return pages.docs.map((doc) => {
      return {
        id: doc.slug === "home" ? "/" : doc.slug || "",
        title: doc.title,
        template: "splash",
        layout: doc.layout as unknown as ContentBlock[],
        tableOfContents: false,
        sidebar: {
          order: 0,
        },
      } satisfies Page
    })
  } catch (error) {
    console.error(error)
    return []
  }
}
