import { Button, Text } from "@react-email/components"
import React from "react"

export function EmailButton(props: {
	href: string
	children: React.ReactNode
	color: "green" | "orange" | "black"
	size: "small" | "large"
}) {
	const { color: propsColor, size: propsSize, href, children } = props

	const color = propsColor === "green"
		? "bg-green-lighter hover:bg-green-dark text-white"
		: propsColor === "orange"
			? "bg-orange-light hover:bg-orange-dark text-black"
			: "bg-green-black hover:bg-black text-white"

	const size = propsSize === "small"
		? "typestyle-text-s font-medium px-[20px] py-[10px]"
		: "typestyle-text-l font-medium h-[56px] px-[24px]"

	return (
		<Button
			href={href}
			className={`inline-block min-w-fit cursor-pointer rounded-full border-2 border-white/10 uppercase no-underline hover:scale-[102%] active:scale-[98%] transition-all duration-200 ${color} ${size}`}
		>
			<Text className="m-auto">{children}</Text>
		</Button>
	)
}
