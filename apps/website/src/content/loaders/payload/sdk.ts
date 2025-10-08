import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from "@collectivechange/payload"
import { CMS_URL } from "astro:env/client"

console.log('Payload SDK initializing, CMS_URL:', CMS_URL)

export const sdk = new PayloadSDK<Config>({
	baseURL: `${CMS_URL}/api`,
})
