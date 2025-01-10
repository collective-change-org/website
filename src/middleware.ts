// import { actions } from "astro:actions"
// import { defineMiddleware } from "astro:middleware"
// // import { client, setTokens } from "./auth"
// // import { subjects } from "../../../subjects"

// export const onRequest = defineMiddleware(async (ctx, next) => {
// 	console.log(ctx.props)
// 	// console.log(ctx)
// 	// const res = await next()

// 	// res.

// 	// return next()
// 	if (ctx.routePattern === "/login") {
// 		return next()
// 	}
// 	if (ctx.props.entry?.restricted && ctx.props.entry.restricted !== "public")
// 		try {
// 			const accessToken = ctx.cookies.get("payload-token")
// 			if (accessToken) {
// 				const { data, error } = await actions.verify()

// 				if (!error) {
// 					console.log("no error")
// 					// if (verified.tokens)
// 					// 	setTokens(ctx, verified.tokens.access, verified.tokens.refresh)
// 					// ctx.locals.subject = verified.subject
// 					return next()
// 				}
// 			}
// 		} catch (e) {}

// 	const url = new URL("http://localhost:4321/")
// 	return ctx.rewrite(
// 		new Request(url.origin + "/login", {
// 			headers: {
// 				"x-redirect-to": ctx.url.pathname,
// 			},
// 		}),
// 	)
// 	// return Response.redirect(`${url.origin}/login`, 302)
// })
