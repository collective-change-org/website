import {
	createMemo,
	type JSX,
	Match,
	Show,
	splitProps,
	Switch,
	type VoidComponent,
} from "solid-js"
import { cn } from "../lib/cn"

type TextInputProps = {
	ref: (element: HTMLInputElement) => void
	type: "text" | "email" | "tel" | "password" | "url" | "number" | "date"
	name: string
	value: string | number | undefined
	onInput: JSX.EventHandler<HTMLInputElement, InputEvent>
	onChange: JSX.EventHandler<HTMLInputElement, Event>
	onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>
	required?: boolean
	class?: string
	label?: string
	error?: string
	helpText?: string
	padding?: "none"
}

export const TextInput: VoidComponent<TextInputProps> = (props) => {
	// Split input element props
	const [, inputProps] = splitProps(props, [
		"class",
		"value",
		"label",
		"error",
		"padding",
	])

	// Create memoized value
	const getValue = createMemo<string | number | undefined>(
		(prevValue) =>
			props.value === undefined
				? ""
				: !Number.isNaN(props.value)
					? props.value
					: prevValue,
		"",
	)
	return (
		<div class={cn("flex flex-col pb-2", props.error && "pb-0")}>
			<div class="flex flex-col gap-2">
				<label for={props.name} class="text-green-black">
					{props.label}
				</label>
				<input
					{...inputProps}
					id={props.name}
					value={getValue()}
					aria-invalid={!!props.error}
					aria-errormessage={`${props.name}-error`}
					aria-describedby={props.helpText && `${props.name}-help`}
					class={cn(
						"h-11 w-full rounded-full bg-white px-6 text-[1.25rem] text-green-dark",
						"ring-2 ring-inset ring-black/10 focus:outline-none focus:ring-green-dark active:ring-green-dark",
						props.error && "ring-orange-dark",
					)}
				/>
			</div>
			<Switch>
				<Match when={props.error}>
					<p class="text-sm text-orange-dark">{props.error}</p>
				</Match>
				<Match when={props.helpText}>
					<p id={`${props.name}-help`} class="text-sm opacity-70">
						{props.helpText}
					</p>
				</Match>
			</Switch>
		</div>
	)
}
