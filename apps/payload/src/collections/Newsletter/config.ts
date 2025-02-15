import { H1Block } from "@/blocks/Headings/H1"
import { H2Block } from "@/blocks/Headings/H2"
import type { CollectionConfig } from "payload"
import { sendNewsletter } from "./sendNewsletter"
import crypto from "crypto"
import { User } from "@/payload-types"
import { PlainRichTextBlock } from "@/blocks/RichText/PlainRichTextBlock"

export const Newsletter: CollectionConfig<"newsletter"> = {
	slug: "newsletter",
	hooks: {
		afterOperation: [sendNewsletter],
	},
	fields: [
		{
			name: "subject",
			label: "Subject",
			type: "text",
			required: true,
		},
		{
			name: "body",
			label: "E-Mail Inhalt",
			type: "blocks",
			blocks: [H1Block, H2Block, PlainRichTextBlock],
			required: true,
			minRows: 2,
		},
	],
	versions: {
		drafts: true,
		maxPerDoc: 25,
	},
	endpoints: [
		{
			path: "/unsubscribe/:token",
			method: "post",
			handler: async (request) => {
				const token = request.routeParams?.token as string | undefined
				if (!token) {
					return new Response("Token is required", { status: 400 })
				}

				const SECRET_KEY = process.env.PAYLOAD_SECRET
				if (!SECRET_KEY) {
					throw new Error(
						"Notification Secret Key is not set in the environment",
					)
				}

				try {
					const [nonce, signature] = token.split(".")

					const subscription = await request.payload.find({
						collection: "notification-settings",
						where: {
							nonce: { equals: nonce },
						},
						limit: 1,
					})

					if (subscription.docs.length === 0) {
					}
					const notificationSetting = subscription.docs[0]

					let user: User
					if (typeof notificationSetting.user === "number") {
						const userDoc = await request.payload.findByID({
							collection: "users",
							id: notificationSetting.user,
						})
						if (!userDoc) {
							return new Response("User not found", {
								status: 404,
							})
						}
						user = userDoc
					} else {
						user = notificationSetting.user
					}

					// Recreate the expected signature
					const data = `${user.id}:${nonce}`
					const expectedHmac = crypto
						.createHmac("sha256", SECRET_KEY)
						.update(data)
						.digest("base64url")

					if (
						!crypto.timingSafeEqual(
							Buffer.from(signature),
							Buffer.from(expectedHmac),
						)
					) {
						// Invalid signature
						return new Response("Invalid Signature", {
							status: 400,
						})
					}

					// Valid token → delete the nonce to prevent reuse
					console.log("Unsubscribing", user.name)
					request.payload.delete({
						collection: "notification-settings",
						where: {
							id: { equals: notificationSetting.id },
						},
					})
				} catch {
					return new Response("Invalid token", { status: 400 })
				}
				return new Response("OK")
			},
		},
	],
}
