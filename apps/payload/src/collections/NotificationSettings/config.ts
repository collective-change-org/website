import type { CollectionConfig } from "payload"
import crypto from "crypto"

export const NotificationSettings: CollectionConfig<"notification-settings"> = {
	slug: "notification-settings",
	admin: {
		hidden: true,
	},
	fields: [
		{
			name: "user",
			type: "relationship",
			relationTo: "users",
			required: true,
			hasMany: false,
		},
		{
			name: "type",
			type: "select",
			options: [
				{ label: "Newsletter", value: "newsletter" },
				{ label: "Event Updates", value: "event" },
			],
		},
		{
			name: "nonce",
			type: "text",
			hooks: {
				beforeChange: [
					async ({ value, operation }) => {
						if (operation === "create") {
							return crypto.randomBytes(16).toString("base64url")
						}
						return value
					},
				],
			},
		},
	],
}
