import { type JSX, Show, splitProps, For } from "solid-js"
import { cn } from "../../lib/cn"

type RadioGroupProps = {
	name: string
	label?: string | undefined
	options: { label: JSX.Element; value: string }[]
	value: string | undefined
	error: string
	required?: boolean | undefined
	disabled?: boolean | undefined
	ref: (element: HTMLInputElement | HTMLTextAreaElement) => void
	onInput: JSX.EventHandler<
		HTMLInputElement | HTMLTextAreaElement,
		InputEvent
	>
	onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>
	onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>
}

export function RadioGroup(props: RadioGroupProps) {
	const [rootProps, inputProps] = splitProps(
		props,
		["name", "value", "required", "disabled"],
		["ref", "onInput", "onChange", "onBlur"],
	)
	return (
		<div {...rootProps} class="relative pb-5">
			<div class="flex flex-col gap-2">
				<For each={props.options}>
					{(option) => (
						<label
							for={option.value}
							class={cn(
								"flex cursor-pointer items-center gap-1 rounded-2xl bg-white p-4 text-green-dark ring-2 ring-inset ring-black/10 checked:ring-green-dark hover:ring-black/20 focus:outline-none focus:ring-green-dark has-[input:checked]:ring-green-dark",
								props.error && "ring-orange-dark",
							)}>
							<input
								class="shrink-0"
								id={option.value}
								type="radio"
								value={option.value}
								{...inputProps}
								name={option.value}
								checked={option.value === props.value}
							/>
							{option.label}
						</label>
					)}
				</For>
			</div>
			<p class="absolute bottom-0 text-sm text-orange-dark">
				{props.error}
			</p>
		</div>
	)
}
