import { cva } from "cva";

export const button = cva({
	base:
		"rounded-full ring-white/10 ring-2 ring-inset uppercase flex items-center gap-1.5 cursor-pointer no-underline min-w-fit",
	variants: {
		intent: {
			green: ["bg-green-lighter hover:bg-green-dark text-white"],
			black: ["bg-green-black hover:bg-black text-white"],
			orange: ["bg-orange-light hover:bg-orange-dark text-black"],
			red: [
				"bg-transparent hover:bg-red-light hover:text-black text-red-light font-medium ring-0",
			],
		},
		size: {
			small: ["text-base", "h-11", "px-5"],
			large: ["text-2xl", "h-14", "px-6"],
		},
		disabled: {
			false: null,
			true: ["opacity-50", "cursor-not-allowed"],
		},
	},
});
