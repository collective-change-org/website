import type { APIRoute } from "astro"
import { LISTMONK_API, LISTMONK_API_KEY } from 'astro:env/server';

export const prerender = false
export const POST: APIRoute = async ({ request }) => {

	const apiURL = new URL(LISTMONK_API)

	try {
		const body = await request.json()
		const email = () => {
			if (typeof body.email === "string") {
				return body.email
			}
			return new Response(JSON.stringify({
				message: "Email is required"
			}), {
				status: 400
			})
		}
		const name = body.name as string | undefined

		const res = await fetch(`${apiURL.origin}/api/subscribers`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `token starlight:${LISTMONK_API_KEY}`,
			},
			body: JSON.stringify({
				email: email(),
				name: name,
				status: "enabled",
				lists: [3],
			}),
		})
		return res

	} catch (error) {
		console.error(error)
		return new Response(JSON.stringify({
			// @ts-ignore
			message: error.message
		}), {
			status: 500
		})

	}
}