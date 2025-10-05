import type { Field } from "payload"

import { link } from "../fields/link"

export const Button: Field = {
	name: "button",
	type: "group",
	fields: [
		link({
			appearances: false,
			overrides: {
				label: false,
			},
		}),
		{
			name: "hasLeftIcon",
			type: "checkbox",
			required: true,
			defaultValue: false,
		},
		{
			name: "iconLeft",
			type: "text",
			required: false,
			admin: {
				condition: (_, { hasLeftIcon }) => hasLeftIcon,
			},
		},
		{
			name: "hasRightIcon",
			type: "checkbox",
			required: true,
			defaultValue: false,
		},
		{
			name: "iconRight",
			type: "text",
			required: false,
			admin: {
				condition: (_, { hasRightIcon }) => hasRightIcon,
			},
		},
		{
			name: "variant",
			type: "select",
			defaultValue: "green",
			options: [
				{ label: "Green", value: "green" },
				{ label: "Orange", value: "orange" },
				{ label: "Black", value: "black" },
			],
			required: true,
		},
		{
			name: "size",
			type: "select",
			defaultValue: "small",
			options: [
				{ label: "Small", value: "small" },
				{ label: "Large", value: "large" },
			],
			required: true,
		},
	],
}
