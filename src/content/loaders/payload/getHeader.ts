import { CMS_URL } from "astro:env/server"
import { authenticatePayload } from "./authenticate"
import { defineCollection, z } from "astro:content"

type PayloadResponse = {
    data: {
        Header: {
            navItems: Array<{
                id: string
                link: {
                  label: string
                  newTab: any
                  url: any
                  reference: {
                    value: {
                      slug: string
                      slugWithGroup: string
                    }
                  }
                }
              }>
        }
    }
}


export async function getHeader(): Promise<HeaderSchema> {
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
            query {
                Header {  
                    navItems {
                    id
                    link {
                        label
                        newTab
                        url
                        reference {
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
    
    const elements = data.data.Header.navItems.map((navItem) => {
        let href: string
        // check if internal link
        if (navItem.link.reference) {
            // check if page or knowlegebase link
            href = (navItem.link.reference.value.slug) ? "/" + navItem.link.reference.value.slug : "/knowledgebase/" + navItem.link.reference.value.slugWithGroup
        } else {
            href = navItem.link.url
        }
        const item: LinkSchema = {
            id: navItem.id,
            label: navItem.link.label,
            newTab: navItem.link.newTab,
            href: href,
        }
        return item
    })
    return elements
}

export const linkSchema = z.object({
    id: z.string(),
    label: z.string(),
    newTab: z.boolean().optional().nullable(),
    href: z.string().optional().nullable(),
})
export type LinkSchema = z.infer<typeof linkSchema>
const headerSchema = z.array(linkSchema)
export type HeaderSchema = z.infer<typeof headerSchema>

export const header = defineCollection({
    loader: getHeader,
    schema: linkSchema
})