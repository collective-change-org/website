import type { Page } from "astro"
import { defineCollection, z } from "astro:content"
import { CMS_URL } from "astro:env/server"
import { authenticatePayload } from "../authenticate"

async function loadEvents() {
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
            Events {
                docs {
                    id 
                    title
                    description
                    date
                    time
                    location
                    image {
                        url
                    }
                    attendees {
                        name
                        id
                        profileImage {url}
                    }
                }
            }
        }
        `,
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

	return body.data.Events.docs.map((event: any) => ({
		...event,
		id: event.id.toString(),
	}))
}

const eventSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	date: z.string(),
	time: z.string().nullable(),
	location: z.string().nullable(),
	image: z
		.object({
			url: z.string(),
		})
		.nullable(),
	attendees: z
		.array(
			z.object({
				name: z.string(),
				id: z.string(),
				profileImage: z
					.object({
						url: z.string(),
					})
					.nullable(),
			}),
		)
		.nullable(),
})
export type Event = z.infer<typeof eventSchema>

export const events = defineCollection({
	loader: () => loadEvents(),
	schema: eventSchema,
})
