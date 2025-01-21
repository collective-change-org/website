import { ConfettiExplosion } from "solid-confetti-explosion"
import {
	createForm,
	FormError,
	minLength,
	required,
	type SubmitHandler,
} from "@modular-forms/solid"
import { createSignal, Match, Show, Switch } from "solid-js"
import { button } from "../Button.astro"
import { actions } from "astro:actions"
import { TextInput } from "../TextInput"

export type NewsletterFormType = {
	name?: string
	email: string
}

export type SignUpFormType = {
	name: string
	email: string
	password: string
}

export default function SignUpForm() {
	const [, SignUp] = createForm<SignUpFormType>()
	const [, Newsletter] = createForm<NewsletterFormType>()

	const [formType, setFormType] = createSignal<"newsletter" | "signup">(
		"newsletter",
	)

	const input =
		"rounded-full border-2 border-black/30 bg-white px-4 py-1 text-black focus:border-green-dark focus:outline-none"

	const handleSignUpSubmit: SubmitHandler<SignUpFormType> = async (
		values,
		event,
	) => {
		const { data, error } = await actions.subscribe(values)
		if (!error) {
			setSuccess("signup")
		}
	}

	const handleNewsletterSubmit: SubmitHandler<NewsletterFormType> = async (
		values,
		event,
	) => {
		const { data, error } = await actions.subscribe(values)
		if (!error) {
			setSuccess("newsletter")
		}
		if (error) {
			throw new FormError<NewsletterFormType>("An error has occurred.", {
				email: error.message,
			})
		}
	}

	const [success, setSuccess] = createSignal<
		"newsletter" | "signup" | undefined
	>(undefined)

	return (
		<div class="flex w-full flex-col gap-8 text-green-black">
			<Show when={success()}>
				<ConfettiExplosion />
				<Switch>
					<Match when={success() === "newsletter"} keyed>
						<p>Subscribed to Newsletter</p>
					</Match>
					<Match when={success() === "signup"} keyed>
						<p>Subscribed to Crew</p>
					</Match>
				</Switch>
			</Show>
			<Show when={!success()}>
				<fieldset class="m-0 w-full p-0">
					<legend>Art der Mitgliedschaft:</legend>

					<div>
						<input
							type="radio"
							id="newsletter"
							name="signup"
							value="newsletter"
							checked={formType() === "newsletter"}
							onInput={() => setFormType("newsletter")}
						/>
						<label for="newsletter" class="font-bold">
							Ich möchte nur den Newsletter abbonieren
						</label>
					</div>

					<div>
						<input
							type="radio"
							id="crew"
							name="signup"
							value="crew"
							checked={formType() === "signup"}
							onInput={() => setFormType("signup")}
						/>
						<label for="crew" class="font-bold">
							Ich möchte Teil der Crew werden
						</label>
					</div>
				</fieldset>
				<Switch>
					<Match when={formType() === "newsletter"} keyed>
						<Newsletter.Form
							class="flex flex-col items-start gap-5"
							onSubmit={handleNewsletterSubmit}>
							<Newsletter.Field name="name">
								{(field, props) => (
									<TextInput
										{...props}
										value={field.value}
										error={field.error}
										type="text"
										label="Name"
									/>
								)}
							</Newsletter.Field>
							<Newsletter.Field
								name="email"
								validate={[
									required("Du musst eine E-Mail angeben"),
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
							</Newsletter.Field>
							<button
								type="submit"
								class={button({
									intent: "green",
									size: "small",
								})}>
								Newsletter Abonnieren
							</button>
						</Newsletter.Form>
					</Match>
					<Match when={formType() === "signup"} keyed>
						<p>Noch nicht verfügbar</p>
					</Match>
				</Switch>
			</Show>
		</div>
	)
}
