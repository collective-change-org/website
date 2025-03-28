import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { getPayload } from "payload"

import { config } from "../../.."
import { renderNewsletter } from "../../../emails/newsletter"
import { RefreshRouteOnSave } from "./refresh-route-on-save"

export default async function Page({
	params: paramsPromise,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await paramsPromise

	if (!slug) {
		return notFound()
	}

	const { isEnabled: isDraftMode } = await draftMode()

	const payload = await getPayload({ config })

	const newsletter = await payload
		.find({
			collection: "newsletter",
			depth: 0,
			draft: isDraftMode,
			limit: 1,
			overrideAccess: isDraftMode,
			where: {
				id: {
					equals: slug,
				},
			},
		})
		?.then(({ docs }) => docs?.[0])

	if (newsletter === null) {
		return notFound()
	}

	return (
		<>
			<RefreshRouteOnSave />
			<html
				dangerouslySetInnerHTML={{
					__html: await renderNewsletter(newsletter.body, ""),
				}}
			/>
		</>
	)
}
