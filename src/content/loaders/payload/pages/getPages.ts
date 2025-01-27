import { CMS_URL } from "astro:env/client"
import { authenticatePayload } from "../authenticate"
import type { LexicalRootContainer } from "../schemas/lexical"
import type { Page } from "."

export type ContentBlock = {
  id: string
  columns: Array<{
    size: number
    richText: LexicalRootContainer
  }>
}

type PayloadResponse = {
  data: {
    Pages: {
      docs: Array<{
        title: string
        slug: string
        layout: ContentBlock[]
      }>
    }
  }
}
//[manifestBlock, loginBlock, signUpBlock])
const baseContainerLayouts = `
... on H1Block {
  blockType
  title
}
... on H2Block {
  blockType
  title
}
... on EmphasizedParagraph {
  blockType
  richText
}
... on ButtonBlock {
  blockType
  link {
    type
    newTab
    label
    url
    reference {
      relationTo
      value {
        ... on Page {
          slug
        }
        ... on Knowledgebase {
          slugWithGroup
        }
      }
    }
  }
  hasLeftIcon
  iconLeft
  hasRightIcon
  iconRight
  variant
  size
}
... on LargeRichTextBlock {
  blockType
  title
  richText
}
... on ManifestBlock {
  blockType
  sections {
    subtitle
    listItem {
      title
      description
    }
  }
}
... on LoginBlock {
  blockType
}
... on signupBlock {
  blockType
}
... on UpcomingEvents {
  blockType
  title
  events {
    title
    description
    date
    time
    location
  }
}
`

export async function getPages(): Promise<Page[]> {
  const bearerToken = await authenticatePayload()
  // Auth
  const { error, result } = bearerToken
  if (error || !result) {
    console.error(error)
    return []
  }

  const cmsUrl = new URL(CMS_URL)
  const query = JSON.stringify({
    query: `
query {
Pages {
  docs {
    title
    slug
    layout {
      ... on ContainerBlock {
        blockType
        color
        layout {
          ${baseContainerLayouts}
          ... on IndentedContainer {
            blockType
            layout {
              ${baseContainerLayouts}
            }
          }
          ... on ColumnContainerBlock {
            blockType
            columns {
              layout {
                ${baseContainerLayouts}
              }
            }
          }
        }
      }
    }

    meta {
      title
      image {
        url
      }
      description
    }
  }
}
  }`,
    headers: {
      Authorization: `Bearer ${result.token}`,
    },
  })

  const response = await fetch(`${cmsUrl.origin}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: query,
  })
  const body = await response.json()
  try {
    const data = body as PayloadResponse

    return data.data.Pages.docs.map((doc) => {
      return {
        id: doc.slug === "home" ? "/" : doc.slug,
        title: doc.title,
        template: "splash",
        layout: doc.layout,
        tableOfContents: false,
        sidebar: {
          order: 0,
        },
      }
    })
  } catch (error) {
    console.error(error)
    return []
  }
}
