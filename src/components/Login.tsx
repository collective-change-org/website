import {
	createForm,
	custom,
	email,
	getValue,
	minLength,
	required,
	type SubmitHandler,
} from "@modular-forms/solid"
import { button } from "./button/button"
import { actions } from "astro:actions"
import { TextInput } from "./TextInput"
import { navigate } from "astro:transitions/client"
import { createSignal, onMount, Show } from "solid-js"

export type LoginForm = {
	email: string
	password: string
}

export default function SignUpForm() {
	const [signUpForm, { Form, Field, FieldArray }] = createForm<LoginForm>()

	const handleLogin: SubmitHandler<LoginForm> = async (values, event) => {
		const { data, error } = await actions.login(values)

		if (!error) {
			// Logged In
			navigate("/")
		}
	}

	const [accountVerified, setAccountVerified] = createSignal(false)

	onMount(async () => {
		if (!window) return
		const urlParams = new URLSearchParams(window.location.search)
		const token = urlParams.get("token")
		if (!token) return
		const { data, error } = await actions.verifyAccount({ token })
		if (!error) {
			setAccountVerified(true)
		}
	})

	return (
		<div class="flex w-full flex-col gap-8 text-green-black">
			<Show when={accountVerified()}>
				<div class="bg-green-100 rounded-lg p-4">
					Du bist jetzt Teil der Crew! 🚀
				</div>
			</Show>
			<Form
				onSubmit={handleLogin}
				class="flex flex-col items-start gap-4">
				<Field
					name="email"
					validate={[
						required("Du musst eine E-Mail angeben."),
						email(
							"Der eingegebene Text scheint keine E-Mail zu sein.",
						),
					]}>
					{(field, props) => (
						<TextInput
							{...props}
							value={field.value}
							error={field.error}
							type="email"
							label="E-Mail"
							required
						/>
					)}
				</Field>
				<Field
					name="password"
					validate={[
						required("Du musst ein Passwort angeben"),
						minLength(
							8,
							"Das Passwort muss mindestens 8 Zeichen lang sein",
						),
					]}>
					{(field, props) => (
						<TextInput
							{...props}
							value={field.value}
							error={field.error}
							type="password"
							label="Passwort"
							required
						/>
					)}
				</Field>
				<button
					type="submit"
					class={button({
						intent: "green",
						size: "small",
					})}>
					Anmelden
				</button>
			</Form>
		</div>
	)
}
