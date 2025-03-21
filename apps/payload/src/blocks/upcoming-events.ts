import type { Block } from "payload"

export const UpcomingEvents: Block = {
	slug: "upcomingEvents",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "events",
			type: "relationship",
			relationTo: "events",
			admin: {
				readOnly: true,
			},
			virtual: true,
			hooks: {
				afterRead: [
					async ({ req }) => {
						// Format date for display
						const events = await req.payload.find({
							collection: "events",
						})
						return events.docs
					},
				],
			},
		},
	],
}
