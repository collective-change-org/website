import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from "@collectivechange/payload"

export const sdk = new PayloadSDK<Config>({
	baseURL: 'http://localhost:3000/api',
})
