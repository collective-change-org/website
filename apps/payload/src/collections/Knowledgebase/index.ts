import type { CollectionConfig, Payload } from "payload"

import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from "@payloadcms/plugin-seo/fields"
import {
	BlocksFeature,
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical"

import type { Group } from "../../payload-types"

import { authenticated } from "../../access/authenticated"
import { authenticatedOrPublished } from "../../access/authenticated-or-published"
import { Aside } from "../../blocks/Aside/config"
import { Code } from "../../blocks/Code/config"
import { LinkCardBlock } from "../../blocks/link-card"
import { MediaBlock } from "../../blocks/MediaBlock/config"
import { slugField } from "../../fields/slug"
import { generatePreviewPath } from "../../utilities/generate-preview-path"
import { populateAuthors } from "./hooks/populate-authors"
import { revalidateDelete, revalidatePost } from "./hooks/revalidate-post"

async function getGroupSlug(groupId: number, payload: Payload): Promise<string | null | undefined> {
	const group = await payload.findByID({
		collection: "groups",
		id: groupId,
	})
	const groupSlug = group.slug
	const parent = group.parent as Group | null
	if (parent) {
		return `${await getGroupSlug(parent.id, payload)}/${groupSlug}`
	}
	return groupSlug
}

export const Knowledgebase: CollectionConfig<"knowledgebase"> = {
	slug: "knowledgebase",
	access: {
		create: authenticated,
		delete: authenticated,
		read: authenticatedOrPublished,
		update: authenticated,
	},
	// This config controls what's populated by default when a post is referenced
	// https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
	// Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
	defaultPopulate: {
		title: true,
		slug: true,
		slugWithGroup: true,
		// group: false,
		meta: {
			image: true,
			description: true,
		},
	},
	admin: {
		defaultColumns: ["title", "slug", "updatedAt"],
		livePreview: {
			url: ({ data, req }) => {
				const path = generatePreviewPath({
					slug: typeof data?.slug === "string" ? data.slug : "",
					collection: "knowledgebase",
					req,
				})

				return path
			},
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: typeof data?.slug === "string" ? data.slug : "",
				collection: "knowledgebase",
				req,
			}),
		useAsTitle: "title",
	},
	fields: [
		{
			type: "collapsible",
			label: "Technisches",
			admin: {
				position: "sidebar",
			},
			fields: [
				...slugField(),
				{
					name: "restricted",
					type: "select",
					options: [
						{
							label: "Public",
							value: "public",
						},
						{
							label: "Members Only",
							value: "members",
						},
					],
					admin: {
						position: "sidebar",
					},
					defaultValue: "public",
				},
			],
		},
		{
			type: "collapsible",
			label: "Viselles",
			admin: {
				position: "sidebar",
			},
			fields: [
				{
					name: "authors",
					type: "relationship",
					admin: {
						position: "sidebar",
					},
					hasMany: true,
					relationTo: "users",
				},
				{
					name: "docOrder",
					label: "Document Order",
					type: "number",
					admin: {
						position: "sidebar",
					},
					hooks: {},
				},
				{
					name: "publishedAt",
					type: "date",
					admin: {
						date: {
							pickerAppearance: "dayAndTime",
						},
						position: "sidebar",
					},
					hooks: {
						beforeChange: [
							({ siblingData, value }) => {
								if (siblingData._status === "published" && !value) {
									return new Date()
								}
								return value
							},
						],
					},
				},
				{
					name: "badge",
					label: "Badge",
					type: "relationship",
					relationTo: "badge",
					hasMany: false,
					admin: {
						position: "sidebar",
					},
				},
			],
		},
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			type: "tabs",
			tabs: [
				{
					fields: [
						{
							name: "group",
							type: "relationship",
							admin: {
								position: "sidebar",
							},
							hasMany: false,
							relationTo: "groups",
						},
						{
							name: "content",
							type: "richText",
							editor: lexicalEditor({
								features: ({ rootFeatures }) => {
									return [
										...rootFeatures,
										HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
										BlocksFeature({ blocks: [Aside, Code, MediaBlock, LinkCardBlock] }),
										FixedToolbarFeature(),
										InlineToolbarFeature(),
										HorizontalRuleFeature(),
									]
								},
							}),
							label: false,
							required: true,
						},
					],
					label: "Content",
				},
				{
					name: "meta",
					label: "SEO",
					fields: [
						OverviewField({
							titlePath: "meta.title",
							descriptionPath: "meta.description",
							imagePath: "meta.image",
						}),
						MetaTitleField({
							hasGenerateFn: true,
						}),
						MetaImageField({
							relationTo: "media",
						}),

						MetaDescriptionField({}),
						PreviewField({
							// if the `generateUrl` function is configured
							hasGenerateFn: true,

							// field paths to match the target field for data
							titlePath: "meta.title",
							descriptionPath: "meta.description",
						}),
					],
				},
			],
		},
		{
			name: "populatedAuthors",
			type: "array",
			access: {
				update: () => false,
			},
			admin: {
				disabled: true,
				readOnly: true,
			},
			fields: [
				{
					name: "id",
					type: "text",
				},
				{
					name: "name",
					type: "text",
				},
			],
		},
		{
			name: "slugWithGroup",
			type: "text",
			admin: {
				readOnly: true,
				hidden: true,
				position: "sidebar",
			},
			hooks: {
				beforeChange: [
					async ({ data, req }) => {
						if (data && data.group) {
							const slug = await getGroupSlug(data.group as number, req.payload)
							return `${slug}/${data.slug}`
						}
						return data?.slug ?? ""
					},
				],
			},
		},
	],
	hooks: {
		afterChange: [revalidatePost],
		afterRead: [populateAuthors],
		afterDelete: [revalidateDelete],
	},
	versions: {
		drafts: {
			autosave: {
				interval: 350, // We set this interval for optimal live preview
			},
		},
		maxPerDoc: 50,
	},
}
