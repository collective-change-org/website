import { Show, Switch, type VoidComponent } from "solid-js"

export const Input: VoidComponent<{
	label: string
	name: string
	type: string
	id: string
	helpText?: string
	error?: string
}> = (props) => {
	return (
		<div class="flex flex-col gap-2">
			<label for={props.name} class="text-green-black">
				{props.label}
			</label>
			<input
				{...props}
				aria-describedby={props.helpText && props.id}
				class="h-14 rounded-full bg-white px-5 py-3 text-[1.25rem] text-green-dark ring-2 ring-inset ring-black/30 focus:outline-none focus:ring-green-dark active:ring-green-dark"
			/>
			<Switch>
				<Show when={props.helpText}>
					<p id={props.id}>{props.helpText}</p>
				</Show>
				<Show when={props.error}>
					<p>{props.error}</p>
				</Show>
			</Switch>
		</div>
	)
}
