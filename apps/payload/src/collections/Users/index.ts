import type { CollectionConfig } from "payload"

import { authenticated } from "../../access/authenticated"
import { renderSignup } from "../../emails/signup"
import { z } from "zod"
import { User } from "../../payload-types"

const modifySchema = z.object({
	name: z.string().optional(),
	profileImage: z.number().optional(),
})

export const Users: CollectionConfig = {
	slug: "users",
	access: {
		admin: authenticated,
		create: () => true,
		delete: authenticated,
		read: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["name", "email"],
		useAsTitle: "name",
	},
	auth: {
		verify: {
			generateEmailHTML: async ({ req, token, user }) => {
				// Use the token provided to allow your user to verify their account
				const emailHtml = await renderSignup(token)

				return emailHtml
			},
		},
	},
	fields: [
		{
			name: "name",
			type: "text",
		},
		{
			name: "role",
			type: "select",
			options: [
				{ label: "Admin", value: "admin" },
				{ label: "Team", value: "team" },
				{ label: "Crew", value: "crew" },
			],
		},
		{
			name: "profileImage",
			type: "upload",
			relationTo: "media",
		},
		{
			name: "notificationSettings",
			type: "join",
			collection: "notification-settings",
			on: "user",
		},
	],
	timestamps: true,
	endpoints: [
		{
			path: "/:id/",
			method: "put",
			handler: async (req) => {
				const id = req.query.id as string

				const { success, data } = modifySchema.safeParse(req.body)

				if (!success || !id) {
					return Response.error()
				}

				const user = await req.payload.findByID({
					id: id,
					collection: "users",
				})

				const updateData: Partial<User> = {}

				if (data.name) {
					updateData.name = data.name
				}

				if (data.profileImage) {
					// Delete the old profile image
					if (user.profileImage) {
						req.payload.delete({
							collection: "media",
							id:
								typeof user.profileImage === "number"
									? user.profileImage
									: user.profileImage.id,
						})
					}

					// Set the new profile image
					updateData.profileImage = data.profileImage
				}

				req.payload.update({
					id: id,
					collection: "users",
					data: updateData,
				})

				return Response.json("ok")
			},
		},
	],
}
