export function isObject(item: unknown): boolean {
	if (item && typeof item === "object" && !Array.isArray(item)) {
		return true
	}
	return false
}

export default function deepMerge<T, R>(target: T, source: R): T {
	const output = { ...target }
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!(key in target)) {
					Object.assign(output, { [key]: source[key] })
				}
				else {
					output[key] = deepMerge(target[key], source[key])
				}
			}
			else {
				Object.assign(output, { [key]: source[key] })
			}
		})
	}

	return output
}
