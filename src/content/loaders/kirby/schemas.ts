import { z } from "astro:content";

export const becomeMember = z.object({
	id: z.string(),
	type: z.literal("become-member"),
	isHidden: z.boolean(),
	content: z.object({
		apiurl: z.string(),
	}),
});

export type BecomeMemberType = z.infer<typeof becomeMember>

const heading = z.object({
	id: z.string(),
	type: z.literal("heading"),
	isHidden: z.boolean(),
	content: z.object({
		level: z.string(),
		text: z.string(),
	}),
});

const image = z.object({
	id: z.string(),
	type: z.literal("image"),
	isHidden: z.boolean(),
	content: z.object({
		location: z.string(),
		src: z.string(),
		alt: z.string(),
		caption: z.string(),
		link: z.string(),
		ratio: z.string(),
		crop: z.string(),
	}),
});

const card = z.object({
	id: z.string(),
	type: z.literal("card"),
	isHidden: z.boolean(),
	content: z.object({
		title: z.string(),
		icon: z.string(),
		content: z.string(),
	}),
});

const internalLink = z.object({
	type: z.literal("internal"),
	title: z.string(),
	description: z.string(),
	url: z.array(z.string()),
});

const externalLink = z.object({
	type: z.literal("external"),
	title: z.string(),
	description: z.string(),
	href: z.string(),
});

const linkCard = z.object({
	id: z.string(),
	type: z.literal("link-card"),
	isHidden: z.boolean(),
	content: z.union([
		internalLink,
		externalLink,
	]),
});

const text = z.object({
	id: z.string(),
	type: z.literal("text"),
	isHidden: z.boolean(),
	content: z.object({
		text: z.string(),
	}),
});

export const block = z.union([heading, image, card, linkCard, text, becomeMember]);