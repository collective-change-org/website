import { CMS_URL, PAYLOAD_EMAIL, PAYLOAD_PASSWORD } from "astro:env/server"

type AuthResult = {
	message: string
	user: {
		id: string
		email: string
		_verified: boolean
		createdAt: string
		updatedAt: string
	}
	token: string
	exp: number
}

export async function authenticatePayload(): Promise<{
	error: string | null
	result: AuthResult | null
}> {
	const cmsUrl = new URL(CMS_URL)
	try {
		const req = await fetch(`${cmsUrl.origin}/api/users/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: PAYLOAD_EMAIL,
				password: PAYLOAD_PASSWORD,
			}),
		})
		const data = await req.json()
		if (!data.token) {
			if (data.message) return { error: data.message, result: null }
			if (data.errors) {
				return { error: JSON.stringify(data.errors), result: null }
			}
		}
		return { error: null, result: data }
	} catch (err) {
		if (err instanceof Error) {
			if (err.message === "Connect Timeout Error") {
				console.log("Connect Timeout Error")
				// Perform a ping to google.com to check if the user has internet connection
				const ping = await fetch("https://www.google.com", {
					method: "HEAD",
				})
				if (!ping.ok) {
					console.error("No internet connection")
					throw new Error("No internet connection")
				}
				if (ping.ok) {
					console.log("ping ok")
					throw new Error("Ping OK, CMS connection failed")
				}
			}

			console.error(err)
			throw new Error(JSON.stringify(err))
		} else {
			console.log("Unknown errorrrr")
			throw new Error(
				JSON.stringify({
					url: `${cmsUrl.origin}/api/users/login`,
					err,
				}),
			)
		}
	}
}
