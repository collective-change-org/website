import type { FieldHook } from "payload"

function format(val: string): string {
	return val
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "")
		.toLowerCase()
}

function formatSlug(fallback: string): FieldHook {
	return ({ data, operation, originalDoc, value }) => {
		if (typeof value === "string") {
			return format(value)
		}

		if (operation === "create") {
			const fallbackData = data?.[fallback] || originalDoc?.[fallback]

			if (fallbackData && typeof fallbackData === "string") {
				return format(fallbackData)
			}
		}

		return value
	}
}

export default formatSlug
