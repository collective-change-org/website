import { defineCollection, z } from "astro:content"
import { getPayload } from "payload"
import { config, type Footer } from "@collectivechange/payload"

function linkToLinkSchema(navItems: Footer["columnOne"]): LinkSchema[] {
    if (!navItems) {
        return []
    }
    return navItems.map((navItem) => {
        let href: string
        // check if internal link
        if (navItem.link.reference) {
            // check if page or knowlegebase link
            const reference = navItem.link.reference.value
            if (typeof reference === "number") {
                href = ""
            } else {
                // If referemce is a page, not a knowledgebase, use the slug
                // If it is a knowledgebase, use the slugWithGroup
                if ("slugWithGroup" in reference) {
                    href = reference.slugWithGroup || ""
                } else {
                    href = reference.slug || ""
                }
            }
        } else {
            href = navItem.link.url || ""
        }
        const item: LinkSchema = {
            id: navItem.id || "",
            label: navItem.link.label,
            newTab: navItem.link.newTab,
            href: href,
        }
        return item
    })
}

function socialLinkToSocialScheme(
    socialLinks: Footer["socialLinks"]
): FooterSchema["socialLinks"] {
    if (!socialLinks) {
        return []
    }
    return socialLinks.map((socialLink) => {
        const link = linkToLinkSchema([socialLink])[0]
        return {
            icon: socialLink.icon,
            link: link,
        }
    })
}

export async function getFooter(): Promise<FooterSchema[]> {
    const payload = await getPayload({ config })
    const footer = await payload.findGlobal({
        slug: "footer",
        depth: 3,
    })

    const columnOne = linkToLinkSchema(footer?.columnOne)
    const columnTwo = linkToLinkSchema(footer?.columnTwo)
    const columnThree = linkToLinkSchema(footer?.columnThree)
    const socialLinks = socialLinkToSocialScheme(footer?.socialLinks)

    console.dir([{
        id: "footer",
        columnOne,
        columnTwo,
        columnThree,
        socialLinks,
    }], {
        depth: Infinity,
    })

    return [
        {
            id: 'footer',
            columnOne,
            columnTwo,
            columnThree,
            socialLinks,
        }
    ]
}

export const linkSchema = z.object({
    id: z.string(),
    label: z.string(),
    newTab: z.boolean().optional().nullable(),
    href: z.string().optional().nullable(),
})
export type LinkSchema = z.infer<typeof linkSchema>
const footerSchema = z.object({
    id: z.string(),
    columnOne: z.array(linkSchema).optional().nullable(),
    columnTwo: z.array(linkSchema).optional().nullable(),
    columnThree: z.array(linkSchema).optional().nullable(),
    socialLinks: z.array(
        z.object({
            icon: z.string(),
            link: linkSchema,
        })
    ),
})
export type FooterSchema = z.infer<typeof footerSchema>

export const footer = defineCollection({
    loader: getFooter,
    schema: footerSchema
})