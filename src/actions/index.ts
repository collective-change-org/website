import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { getHeaders } from '../content/loaders/kirby/getHeaders';

async function getCSRF() {
	const csrf = await fetch('https://capslock-cms.test/api/csrf', {
		headers: getHeaders()
	})
	return await csrf.text()
}
export const server = {
	login: defineAction({
		accept: 'form',
		input: z.object({
			email: z.string().email(),
			password: z.string(),
		}),
		handler: async ({ email, password }, ctx) => {
			const basicAuth = Buffer.from(`${email}:${password}`).toString('base64')

			const headers = new Headers({
				'Content-Type': 'application/json',
				'X-CSRF': await getCSRF(),
				'Authorization': `Basic ${basicAuth}`
			})

			const request = await fetch('https://capslock-cms.test/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password, long: false }),
				headers
			}).catch((e) => {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: e,
				});
			})
				.then((res) => {
					console.log(res)
					if (!res.ok) {
						throw new ActionError({
							code: "UNAUTHORIZED",
							message: "Invalid email or password",
						});
					}
					// Log res headers
					const setCookie = res.headers.get('set-cookie')
					const cookieList = setCookie?.split(';').map((cookie) => cookie.split('=').map((c) => c.trim()))
					// ctx.cookies.set('token', res.headers.get('Authorization') || '')
					for (const [key, value] of cookieList || []) {
						ctx.cookies.set(key, value)
					}
					return res.json();
				})
			return request
		},
	})
}