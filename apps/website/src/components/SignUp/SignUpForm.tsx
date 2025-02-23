import {
	createForm,
	custom,
	email,
	FormError,
	getValue,
	minLength,
	required,
	setError,
	type SubmitHandler,
} from "@modular-forms/solid"
import { button } from "../button/button"
import { actions } from "astro:actions"
import { TextInput } from "../TextInput"
import { navigate } from "astro:transitions/client"
import { createSignal, Match, Show, Switch } from "solid-js"
import { cn } from "../../lib/cn"
import { RadioGroup } from "./Group"
import { Spinner } from "../UpcomingEvents/Spinner"
import { ConfettiExplosion } from "solid-confetti-explosion"

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
	const [loading, setLoading] = createSignal(false)
	const [signupError, setSignupError] = createSignal<string>()

	const handleSignUpSubmit: SubmitHandler<SignUpFormType> = async (
		values,
		event,
	) => {
		event.preventDefault()
		setLoading(true)
		const { data, error } = await actions.signup(values)

		if (!error) {
			// Signed Up
			setLoading(false)
			setSuccess(true)
		}
		if (error) {
			setLoading(false)
			setSignupError(
				"Huch, wir konnten dich leider nicht anmelden. Überprüfe deine E-Mail und versuche es noch einmal!",
			)
		}
	}

	const [success, setSuccess] = createSignal(false)

	const [checkbox, setCheckbox] = createSignal<HTMLInputElement>()

	return (
		<div class="flex w-fit max-w-5xl flex-col gap-8 text-green-black">
			<Switch>
				<Match when={success()}>
					<div class="">
						<ConfettiExplosion
							colors={[
								"#002922",
								"#338073",
								"#EB742F",
								"#FF8640",
								"#F1FF86",
								"#E3FF0C",
							]}
							class="absolute left-1/2"
						/>
						<p class="typestyle-h3">
							Du bist jetzt Teil der Crew! 🚀
						</p>
						<p class="typestyle-text-l">
							Du hast gerade eine E-Mai an die Adresse{" "}
							<code>{getValue(signUpForm, "email")}</code>{" "}
							bekommen.
						</p>
						<p class="typestyle-text-l">
							Klicke dort auf den Link, um deinen Account zu
							bestätigen!
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
						<Show when={signupError()}>
							<p class="text-orange-dark">{signupError()}</p>
						</Show>
						<p>{signUpForm.response.message}</p>
						<button
							disabled={loading()}
							type="submit"
							class={cn(
								button({
									intent: "green",
									size: "small",
								}),
								"group",
							)}>
							<Show when={!loading()} fallback={<Spinner />}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									viewBox="0 0 256 256">
									<path
										d="M184,120v61.65a8,8,0,0,1-2.34,5.65l-34.35,34.35a8,8,0,0,1-13.57-4.53L128,176ZM136,72H74.35a8,8,0,0,0-5.65,2.34L34.35,108.69a8,8,0,0,0,4.53,13.57L80,128ZM40,216c37.65,0,50.69-19.69,54.56-28.18L68.18,161.44C59.69,165.31,40,178.35,40,216Z"
										opacity="0.2"></path>
									<path d="M223.85,47.12a16,16,0,0,0-15-15c-12.58-.75-44.73.4-71.41,27.07L132.69,64H74.36A15.91,15.91,0,0,0,63,68.68L28.7,103a16,16,0,0,0,9.07,27.16l38.47,5.37,44.21,44.21,5.37,38.49a15.94,15.94,0,0,0,10.78,12.92,16.11,16.11,0,0,0,5.1.83A15.91,15.91,0,0,0,153,227.3L187.32,193A15.91,15.91,0,0,0,192,181.64V123.31l4.77-4.77C223.45,91.86,224.6,59.71,223.85,47.12ZM74.36,80h42.33L77.16,119.52,40,114.34Zm74.41-9.45a76.65,76.65,0,0,1,59.11-22.47,76.46,76.46,0,0,1-22.42,59.16L128,164.68,91.32,128ZM176,181.64,141.67,216l-5.19-37.17L176,139.31Zm-74.16,9.5C97.34,201,82.29,224,40,224a8,8,0,0,1-8-8c0-42.29,23-57.34,32.86-61.85a8,8,0,0,1,6.64,14.56c-6.43,2.93-20.62,12.36-23.12,38.91,26.55-2.5,36-16.69,38.91-23.12a8,8,0,1,1,14.56,6.64Z"></path>
								</svg>
								Teil der Crew werden
							</Show>
						</button>
					</Form>
				</Match>
			</Switch>
		</div>
	)
}
