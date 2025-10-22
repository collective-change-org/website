import type { CollectionAfterChangeHook } from "payload"

export const triggerDeploy: CollectionAfterChangeHook = async ({ req: { payload }, doc }) => {
	if (doc._status === "published" && process.env.NODE_ENV === "production") {
		payload.logger.info(`Triggering Deployment Update`)

		const workflowId = "publish_website.yaml"
		const bearerToken = process.env.GITHUB_TOKEN

		if (!bearerToken) {
			throw new Error("GITHUB_TOKEN environment variable is not set")
		}

		await fetch(`https://api.github.com/repos/collective-change-org/website/actions/workflows/${workflowId}/dispatches`, {
			method: "POST",
			headers: {
				"Accept": "application/vnd.github+json",
				"Authorization": `Bearer ${bearerToken}`,
				"X-GitHub-Api-Version": "2022-11-28",
			},
			body: JSON.stringify({ ref: "main" }),
		})
	}

	return doc
}
