import { CollectionAfterChangeHook, CollectionAfterOperationHook } from "payload";

export const publishPost: CollectionAfterChangeHook = async ({ operation, req, doc }) => {
	console.log(operation, doc)
	if (operation === 'create') {
		// Send a notification to all users
	}
	return doc
}