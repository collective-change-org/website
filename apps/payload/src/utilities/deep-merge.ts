export function isObject(item: unknown): boolean {
	if (item && typeof item === "object" && !Array.isArray(item)) {
		return true
	}
	return false
}

export default function deepMerge<T extends Record<string, any>, R extends Record<string, any>>(
	target: T,
	source: R,
): T & R {
	// Use a regular object to allow property assignments
	const output = { ...target } as Record<string, any>

	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			const sourceValue = source[key]
			const targetValue = target[key as keyof T]

			if (isObject(sourceValue)) {
				if (!(key in target)) {
					output[key] = sourceValue
				}
				else {
					output[key] = deepMerge(
						targetValue as Record<string, any>,
						sourceValue,
					)
				}
			}
			else {
				output[key] = sourceValue
			}
		})
	}

	// Cast the final result to T & R
	return output as T & R
}
