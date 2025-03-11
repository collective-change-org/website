import { defineCollection, z } from "astro:content"
import { lexicalRootContainer } from "../schemas/lexical"
import { getPayload } from 'payload'
import { config } from '@collectivechange/payload'

async function loadEvents() {
	const payload = await getPayload({ config })
	const events = await payload.find({
		collection: 'events',
	})

	return events.docs.map((event: any) => ({
		...event,
		id: event.id.toString(),
	}))
}

export const eventSchema = z.object({
	id: z.number(),
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
		.array(z.number())
		.nullable(),
})
export type Event = z.infer<typeof eventSchema>

export const events = defineCollection({
	loader: () => loadEvents(),
	schema: eventSchema,
})
