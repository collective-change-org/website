import { z } from "astro:content"

export const ImageUpload = z.object({
	id: z.number(),
	alt: z.string(),
	caption: z.null(),
	updatedAt: z.string(),
	createdAt: z.string(),
	url: z.string(),
	thumbnailURL: z.string(),
	filename: z.string(),
	mimeType: z.string(),
	filesize: z.number(),
	width: z.number(),
	height: z.number(),
	focalX: z.number(),
	focalY: z.number(),
	sizes: z.object({
		thumbnail: z.object({
			url: z.string(),
			width: z.number(),
			height: z.number(),
			mimeType: z.string(),
			filesize: z.number(),
			filename: z.string()
		}),
		square: z.object({
			url: z.string(),
			width: z.number(),
			height: z.number(),
			mimeType: z.string(),
			filesize: z.number(),
			filename: z.string()
		}),
		small: z.object({
			url: z.string(),
			width: z.number(),
			height: z.number(),
			mimeType: z.string(),
			filesize: z.number(),
			filename: z.string()
		}),
		medium: z.object({
			url: z.string(),
			width: z.number(),
			height: z.number(),
			mimeType: z.string(),
			filesize: z.number(),
			filename: z.string()
		}),
		large: z.object({
			url: z.string(),
			width: z.number(),
			height: z.number(),
			mimeType: z.string(),
			filesize: z.number(),
			filename: z.string()
		}),
		xlarge: z.object({
			url: z.string().nullable(),
			width: z.number().nullable(),
			height: z.number().nullable(),
			mimeType: z.string().nullable(),
			filesize: z.number().nullable(),
			filename: z.string().nullable()
		}),
		og: z.object({
			url: z.string(),
			width: z.number(),
			height: z.number(),
			mimeType: z.string(),
			filesize: z.number(),
			filename: z.string()
		})
	})
})
