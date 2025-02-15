import {
	createForm,
	custom,
	email,
	getValue,
	minLength,
	required,
	type SubmitHandler,
} from "@modular-forms/solid"
import { button } from "../button/button"
import { actions } from "astro:actions"
import { TextInput } from "../TextInput"
import { navigate } from "astro:transitions/client"
import { createSignal, Match, Switch } from "solid-js"
import { cn } from "../../lib/cn"
import { RadioGroup } from "./Group"

export type SignUpFormType = {
	name: string
	email: string
	password: string
	verifyPassword: string
	newsletter: "newsletter" | "no-newsletter"
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
			// Signed Up
			setSuccess(true)
		}
	}

	const [success, setSuccess] = createSignal(false)

	const [checkbox, setCheckbox] = createSignal<HTMLInputElement>()

	return (
		<div class="flex w-full max-w-[400px] flex-col gap-8 text-green-black">
			<Switch>
				<Match when={success()}>
					<div class="">
						<p>Du bist jetzt Teil der Crew! 🚀</p>
						<p>
							Du hast gerade eine E-Mai an die Adresse{" "}
							<code>{getValue(signUpForm, "email")}</code>{" "}
							bekommen. Klicke dort auf den Link, um deinen
							Account zu bestätigen!
						</p>
					</div>
				</Match>
				<Match when={!success()}>
					<Form
						onSubmit={handleSignUpSubmit}
						class="flex flex-col items-start gap-4">
						<Field
							name="name"
							validate={[
								required("Du musst einen Namen angeben"),
							]}>
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
									const password = getValue(
										signUpForm,
										"password",
									)
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
						<Field
							name="newsletter"
							type="string"
							validate={[
								required(
									"Du musst auswählen, ob du den Newsletter erhalten möchtest",
								),
							]}>
							{(field, props) => (
								<RadioGroup
									{...props}
									label="Framework"
									options={[
										{
											label: (
												<div class="flex flex-col">
													<h5 class="typestyle-text-s font-bold">
														Newsletter abonnieren
													</h5>
													<div class="flex flex-wrap gap-1">
														<span class="textstyle-text-xs rotate-[1.13deg] bg-pink-light px-2">
															Nächste Events
														</span>
														<span class="textstyle-text-xs rotate-[-2.58deg] bg-pink-light px-2">
															Neue Beiträge
														</span>
														<span class="textstyle-text-xs rotate-[-.58deg] bg-pink-light px-2">
															Max. 1 × im Monat
														</span>
														<span class="textstyle-text-xs rotate-[.58deg] bg-pink-light px-2">
															Neue
															Wissens-Einträge
														</span>
													</div>
												</div>
											),
											value: "newsletter",
										},
										{
											label: (
												<div class="flex flex-col">
													<h5 class="typestyle-text-s font-bold">
														Account erstellen ohne
														Newsletter
													</h5>
												</div>
											),
											value: "no-newsletter",
										},
									]}
									value={field.value}
									error={field.error}
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
				</Match>
			</Switch>
		</div>
	)
}
