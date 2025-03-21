import type { CollectionConfig } from "payload"

import crypto from "node:crypto"

import { H1Block } from "@/blocks/headings/h1"
import { H2Block } from "@/blocks/headings/h2"
import { H3Block } from "@/blocks/headings/h3"
import { PlainRichTextBlock } from "@/blocks/RichText/plain-rich-text-block"

import type { User } from "../../payload-types"

import { sendNewsletter } from "./send-newsletter"

export const Newsletter: CollectionConfig<"newsletter"> = {
	slug: "newsletter",
	hooks: {
		afterOperation: [sendNewsletter],
	},
	admin: {
		livePreview: {
			url: ({ data }) => {
				const id = data?.id
				if (!id)
					return ""
				const encodedParams = new URLSearchParams({
					slug: id as string,
					collection: "newsletter",
					path: `/preview/${id}`,
					previewSecret: process.env.PREVIEW_SECRET || "",
				})

				return `/preview?${encodedParams.toString()}`
			},
		},
		components: {
			edit: {
				PublishButton: "/collections/Newsletter/PublishButton",
			},
		},
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
			blocks: [H1Block, H2Block, H3Block, PlainRichTextBlock],
			required: true,
			minRows: 2,
		},
	],
	versions: {
		drafts: {
			autosave: {
				interval: 375,
			},
			schedulePublish: true,
		},
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
						return new Response("Token not found", { status: 404 })
					}
					const notificationSetting = subscription.docs[0]

					let user: User
					if (typeof notificationSetting.user === "number") {
						const userDoc = await request.payload.findByID({
							collection: "users",
							id: notificationSetting.user,
						})
						if (!userDoc) {
							request.payload.logger.error(
								`User not found for notification setting ${notificationSetting.id}`,
							)
							return new Response("User not found", {
								status: 404,
							})
						}
						user = userDoc
					}
					else {
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
						request.payload.logger.error(`Invalid signature for user ${user.id}`)
						// Invalid signature
						return new Response("Invalid Signature", {
							status: 400,
						})
					}

					// Valid token → delete the nonce to prevent reuse
					request.payload.delete({
						collection: "notification-settings",
						where: {
							id: { equals: notificationSetting.id },
						},
					})
				}
				catch {
					request.payload.logger.error(`Invalid token ${token}`)
					return new Response("Invalid token", { status: 400 })
				}
				return new Response("OK")
			},
		},
	],
}
