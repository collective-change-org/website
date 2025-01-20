import { CMS_URL } from "astro:env/server"
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

export async function getPages(): Promise<Page[]> {
	const bearerToken = await authenticatePayload()
	// Auth
	const { error, result } = bearerToken
	if (error || !result) {
		console.error(error)
		return []
	}

	const cmsUrl = new URL(CMS_URL)

	const response = await fetch(`${cmsUrl.origin}/api/graphql`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
query pages {
  Pages {
    docs {
      title
      slug
      layout {
        ... on ContainerBlock {
          blockType
          color
          layout {
            ... on H1Block {
              blockType
              title
            }
            ... on H2Block {
              blockType
              title
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
            ... on IndentedContainer {
              blockType
              layout {
                ... on H1Block {
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
                    __typename
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
              }
            }
            ... on H2Block {
              blockType
              title
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
            ... on ColumnContainerBlock {
              blockType
              columns {
                layout {
                  ... on H1Block {
                    blockType
                    title
                  }
                  ... on H2Block {
                    blockType
                    title
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
                  ... on IndentedContainer {
                    blockType
                    layout {
                      ... on H1Block {
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
                          __typename
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
                    }
                  }
                  ... on H2Block {
                    blockType
                    title
                  }
				... on LargeRichTextBlock {
                    blockType
                    title
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
                }
              }
            }
          }
        }
        ... on LoginBlock {
          blockType
          richText
        }
        ... on signupBlock {
          blockType
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
}

		`,
			headers: {
				Authorization: `Bearer ${result.token}`,
			},
		}),
	})

	const data = (await response.json()) as PayloadResponse

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
}
