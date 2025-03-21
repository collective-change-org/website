import { ActionError, defineAction } from "astro:actions"
import { z } from "astro:schema"
import { CMS_URL } from "astro:env/client"
import { authenticatePayload } from "../content/loaders/payload/authenticate"

export type User = {
	role: "crew" | "team" | "admin"
	id: number
	name: string
	email: string
	loginAttempts: number
	profileImage: {
		url: string
	} | null
}

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

const cmsUrl = new URL(CMS_URL)
export const server = {
	login: defineAction({
		input: z.object({
			email: z.string().email(),
			password: z.string(),
		}),
		handler: async ({ email, password }, ctx) => {
			const headers = new Headers({
				"Content-Type": "application/json",
			})

			const res = await fetch(`${cmsUrl.origin}/api/users/login`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					email,
					password,
				}),
			}).catch((e) => {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: e,
				})
			})
			if (res.status !== 200) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "Invalid email or password",
				})
			}
			// // Log res headers
			const setCookie = res.headers.get("set-cookie")

			let cookie
			const values = setCookie?.split(";")
			if (!values) return
			for (const value of values) {
				const pair = value.split("=")
				const key = pair[0].trim() as string | undefined
				const val = pair[1].trim() as string | undefined
				if (!key || !val) continue
				if (!cookie) {
					cookie = {
						[key]: val,
					}
				} else {
					cookie[key] = val as string
				}
			}

			if (!cookie || !cookie["payload-token"]) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "Couldnt parse cookie",
				})
			}
			ctx.cookies.set("payload-token", cookie["payload-token"], {
				sameSite: "lax",
				path: cookie["Path"],
				httpOnly: true,
				expires: new Date(cookie["Expires"]),
			})
			return true
		},
	}),
	verify: defineAction({
		handler: async (_, ctx) => {
			const headers = new Headers({
				"Content-Type": "application/json",
				Authorization: ctx.cookies.get("payload-token")?.value
					? `JWT ${ctx.cookies.get("payload-token")!.value}`
					: "",
			})

			const res = await fetch(`${cmsUrl.origin}/api/users/me`, {
				method: "GET",
				headers,
			})

			const body = (await res.json()) as {
				user: User | undefined
				message: "Account"
			}

			return body.user
		},
	}),
	logout: defineAction({
		handler: async (_, ctx) => {
			// const res = await fetch(`${cmsUrl}/api/users/logout`, {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// })
			ctx.cookies.delete("payload-token", {
				path: "/",
				sameSite: "lax",
			})
		},
	}),
	signup: defineAction({
		input: z.object({
			name: z.string(),
			email: z.string().email(),
			password: z.string(),
			newsletter: z.union([z.literal("newsletter"), z.literal("no-newsletter")]),
		}),
		handler: async ({ name, email, password, newsletter }) => {
			const res = await fetch(`${cmsUrl.origin}/api/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					email,
					password,
					role: "crew",
				}),
			})
			const data = await res.json()
			if (res.status !== 201) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: data.message,
				})
			}

			const bearerToken = await authenticatePayload()
			if (newsletter === "newsletter") {
				const res = await fetch(`${cmsUrl.origin}/api/notification-settings`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${bearerToken.result?.token}`,
					},
					body: JSON.stringify({
						user: data.doc.id,
						type: "newsletter",
					}),
				}).catch((e) => {
					throw new ActionError({
						code: "BAD_REQUEST",
						message: e,
					})
				})
			}
			await fetch(`${cmsUrl.origin}/api/notification-settings`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${bearerToken.result?.token}`,
				},
				body: JSON.stringify({
					user: data.doc.id,
					type: "event",
				}),
			}).catch((e) => {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: e,
				})
			})

			return data
		},
	}),
	verifyAccount: defineAction({
		input: z.object({
			token: z.string(),
		}),
		handler: async ({ token }) => {
			const res = await fetch(
				`${cmsUrl.origin}/api/users/verify/${token}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			)
			const data = await res.json()
			if (res.status !== 200) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: data.message,
				})
			}
			return data
		},
	}),
	// getEventById: defineAction({
	// 	input: z.object({
	// 		id: z.string(),
	// 	}),
	// 	handler: async ({ id }, ctx) => {
	// 		return false
	// 		// const payload = await getPayload({ config })
	// 		// const event = await payload.findByID({
	// 		// 	id: parseInt(id),
	// 		// 	collection: "events",
	// 		// })



	// 		// const headers = new Headers({
	// 		// 	"Content-Type": "application/json",
	// 		// 	Authorization: ctx.cookies.get("payload-token")?.value
	// 		// 		? `JWT ${ctx.cookies.get("payload-token")!.value}`
	// 		// 		: "",
	// 		// })

	// 		// const userRes = await fetch(`${cmsUrl.origin}/api/users/me`, {
	// 		// 	method: "GET",
	// 		// 	headers,
	// 		// })

	// 		// const body = (await userRes.json()) as {
	// 		// 	user: User | undefined
	// 		// 	message: "Account"
	// 		// }

	// 		// let isParticipating = false

	// 		// if (body.user) {
	// 		// 	if (!event.attendees) return
	// 		// 	isParticipating = event.attendees?.some(
	// 		// 		(attendee) => {
	// 		// 			const attendeeId = typeof attendee === "number" ? attendee : attendee.id
	// 		// 			return attendeeId === body.user?.id
	// 		// 		},
	// 		// 	)
	// 		// }

	// 		// return {
	// 		// 	event,
	// 		// 	isParticipating
	// 		// }
	// 	},
	// }),
	attendEvent: defineAction({
		input: z.object({
			id: z.number(),
		}),
		handler: async ({ id }, ctx) => {
			const res = await fetch(`${cmsUrl.origin}/api/events/${id}/attend`, {
				// const res = await fetch(`${cmsUrl.origin}/api/events/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: ctx.cookies.get("payload-token")?.value
						? `JWT ${ctx.cookies.get("payload-token")!.value}`
						: "",
				},
			})
			const data = await res
			if (res.status !== 200) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: data.statusText,
				})
			}
			return data.ok
		},
	}),
	cancelEvent: defineAction({
		input: z.object({
			id: z.number(),
		}),
		handler: async ({ id }, ctx) => {
			const res = await fetch(`${cmsUrl.origin}/api/events/${id}/attend`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: ctx.cookies.get("payload-token")?.value
						? `JWT ${ctx.cookies.get("payload-token")!.value}`
						: "",
				},
			})
			const data = await res
			if (res.status !== 200) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: data.statusText,
				})
			}
			return data.ok
		},
	}),
	// Modify Account
	// Email, Name, Pssworrt, Bild, ggf. Pronomen
	modifyAccount: defineAction({
		accept: "form",
		input: z.object({
			userId: z.number(),
			email: z.string().email().optional(),
			name: z.string().optional(),
			profileImage: z
				.any()
				.refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
				.refine(
					(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
					".jpg, .jpeg, .png and .webp files are accepted."
				).optional(),
		}),
		handler: async ({ userId, name, email, profileImage }, ctx) => {
			return false
			// const payload = await getPayload({ config })

			// payload.logger.info("Modifying account")

			// const image = profileImage as File | undefined
			// console.log("image", image)

			// let body
			// if (name) {
			// 	body = { name }
			// }
			// if (email) {
			// 	body = {
			// 		...body,
			// 		email
			// 	}
			// }


			// const user = await payload.findByID({
			// 	id: userId,
			// 	collection: "users",
			// })


			// const updateData: Partial<PayloadUser> = {}

			// if (name) {
			// 	updateData.name = name
			// }

			// if (image) {
			// 	if (user.profileImage) {
			// 		const buffer = await image.arrayBuffer()
			// 		payload.logger.info("Updating existing profile image")
			// 		payload.logger.info(`Media Type: ${image.type}`)

			// 		// Delete existing profile image
			// 		await payload.delete({
			// 			collection: "media",
			// 			where: {
			// 				id: { equals: typeof user.profileImage === "number" ? user.profileImage : user.profileImage.id },
			// 			},
			// 		})

			// 		const newImage = await payload.create({
			// 			collection: "media",
			// 			file: {
			// 				data: Buffer.from(buffer),
			// 				mimetype: image.type,
			// 				name: `${userId}-profile-image`,
			// 				size: image.size,
			// 			},
			// 			data: {
			// 				alt: `${name} profile image`,
			// 				filename: `${userId}-profile-image`,
			// 			},
			// 			overwriteExistingFiles: true
			// 		})

			// 		// Update user with new profile image
			// 		updateData.profileImage = newImage
			// 	} else {
			// 		const buffer = await image.arrayBuffer()
			// 		payload.logger.info("Creating new profile image")
			// 		payload.logger.info(`Media Type: ${image.type}`)
			// 		const media = await payload.create({
			// 			collection: "media",
			// 			file: {
			// 				data: Buffer.from(buffer),
			// 				mimetype: image.type,
			// 				name: `${userId}-profile-image`,
			// 				size: image.size,
			// 			},
			// 			data: {
			// 				alt: `${name} profile image`,
			// 			},
			// 		})
			// 		updateData.profileImage = media
			// 	}
			// }

			// payload.update({
			// 	id: userId,
			// 	collection: "users",
			// 	data: updateData,
			// })

			// return true
		},
	}),
}
