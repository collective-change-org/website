import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { getHeaders } from '../content/loaders/kirby/getHeaders';

async function getCSRF(headers: Headers) {
	const csrf = await fetch('https://capslock-cms.test/api/csrf', {
		headers
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
			const csrf = await getCSRF(new Headers({
				'Authorization': `Basic ${basicAuth}`
			}))

			const headers = new Headers({
				'Content-Type': 'application/json',
				'X-CSRF': csrf,
				'Authorization': `Basic ${basicAuth}`
			})
			console.log(headers)

			const res = await fetch('https://capslock-cms.test/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password, long: false }),
				headers
			}).catch((e) => {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: e,
				});
			})
			console.log(res.status)
			if (res.status !== 200) {
				console.error("Wrong status")
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "Invalid email or password",
				});
			}
			// Log res headers
			const setCookie = res.headers.get('set-cookie')
			const cookieList = setCookie?.split(';').map((cookie) => cookie.split('=').map((c) => c.trim()))
			// console.log(await res.json())
			// ctx.cookies.set('token', res.headers.get('Authorization') || '')
			cookieList?.forEach((cookie) => {
				if (!cookie[0] || !cookie[1]) return
				ctx.cookies.set(cookie[0], cookie[1], { sameSite: "strict", path: '/' })
			})
			console.log(csrf)
			ctx.cookies.set('csrf', csrf, { sameSite: "strict", path: '/' })
			return "";
		},
	}),
	verify: defineAction({
		accept: "json",
		input: z.object({
			token: z.string()
		}),
		handler: async ({ token }, ctx) => {
			// console.log(ctx.cookies.get('kirby_session')?.value)
			const headers = new Headers({
				// 'Content-Type': 'application/json',
				"Cookie": `kirby_session=${ctx.cookies.get('kirby_session')?.value}` || '',
			})
			const csrf = await getCSRF(headers)
			headers.set('x-csrf', csrf)
			console.log(headers)
			const request = await fetch('https://capslock-cms.test/api/auth/', {
				method: 'GET',
				headers
			}).catch((e) => {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: e,
				});
			})
				.then((res) => {
					// console.log(res)
					if (!res.ok) {
						throw new ActionError({
							code: "UNAUTHORIZED",
							message: "Invalid token",
						});
					}
					return;
				})
			return request
		}
	}),
}