import { defineCollection, z } from "astro:content"
import { CMS_URL } from "astro:env/client"
import { authenticatePayload } from "../authenticate"
import { lexicalRootContainer } from "../schemas/lexical"
import { getPayload } from 'payload'
import { config } from '@collectivechange/payload'

export const eventsQueryFields = `
	id
	title
	description
	date
	time
	left
	right
	image {
		url
	}
	attendees {
		name
		id
		profileImage {url}
	}
`

async function loadEvents() {
	const bearerToken = await authenticatePayload()
	// Auth
	const { error, result } = bearerToken
	if (error || !result) {
		console.error(error)
		return []
	}

	const payload = await getPayload({ config })
	const events = await payload.find({
		collection: 'events',
	})

	return events.docs.map((event: any) => ({
		...event,
		id: event.id.toString(),
	}))
}

const eventSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: lexicalRootContainer,
	date: z.string(),
	time: z.string().nullable(),
	left: lexicalRootContainer,
	right: lexicalRootContainer,
	image: z
		.object({
			url: z.string(),
		})
		.nullable(),
	attendees: z
		.array(
			z.object({
				id: z.number(),
				name: z.string(),
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
