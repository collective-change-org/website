import type { FieldHook } from "payload"

export function formatSlug(val: string): string {
	return val
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "")
		.toLowerCase()
}

export function formatSlugHook(fallback: string): FieldHook {
	return ({ data, operation, value }) => {
		if (typeof value === "string") {
			return formatSlug(value)
		}

		if (operation === "create" || !data?.slug) {
			const fallbackData = data?.[fallback] || data?.[fallback]

			if (fallbackData && typeof fallbackData === "string") {
				return formatSlug(fallbackData)
			}
		}

		return value
	}
}
