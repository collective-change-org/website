import {
	createForm,
	custom,
	email,
	getValue,
	minLength,
	required,
	type SubmitHandler,
} from "@modular-forms/solid"
import { button } from "../Button.astro"
import { actions } from "astro:actions"
import { TextInput } from "../TextInput"
import { navigate } from "astro:transitions/client"
import { createSignal } from "solid-js"

export type SignUpFormType = {
	name: string
	email: string
	password: string
	verifyPassword: string
}

export default function SignUpForm() {
	const [signUpForm, { Form, Field, FieldArray }] =
		createForm<SignUpFormType>()

	const handleSignUpSubmit: SubmitHandler<SignUpFormType> = async (
		values,
		event,
	) => {
		const { data, error } = await actions.signup(values)

		if (!error) {
			// Email and Password to formdata
		}
		console.log(data, error)
	}

	const [success, setSuccess] = createSignal(false)

	return (
		<div class="flex w-full flex-col gap-8 text-green-black">
			<Form
				onSubmit={handleSignUpSubmit}
				class="flex flex-col items-start gap-4">
				<Field
					name="name"
					validate={[required("Du musst einen Namen angeben")]}>
					{(field, props) => (
						<TextInput
							{...props}
							value={field.value}
							error={field.error}
							type="text"
							label="Name"
							required
						/>
					)}
				</Field>
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
							helpText="Das Passwort muss mindestens 8 Zeichen lang sein"
							required
						/>
					)}
				</Field>
				<Field
					name="verifyPassword"
					validate={[
						required("Du musst das Passwort wiederholen"),
						custom((value) => {
							// Get values of a field array
							const password = getValue(signUpForm, "password")
							return password === value
						}, "Die Passwörter stimmen nicht überein."),
					]}>
					{(field, props) => (
						<TextInput
							{...props}
							value={field.value}
							error={field.error}
							type="password"
							label="Passwort wiederholen"
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
					Teil der crew werden
				</button>
			</Form>
		</div>
	)
}
