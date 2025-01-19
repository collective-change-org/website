import { ConfettiExplosion } from "solid-confetti-explosion"
import {
	createForm,
	FormError,
	required,
	type SubmitHandler,
} from "@modular-forms/solid"
import { createSignal, Match, Show, Switch } from "solid-js"
import { button } from "../Button.astro"
import { actions } from "astro:actions"

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
		<div class="w-full">
			<Show when={success()}>
				<ConfettiExplosion />
				<Switch>
					<Match when={success() === "newsletter"}>
						<p>Subscribed to Newsletter</p>
					</Match>
					<Match when={success() === "signup"}>
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
					<Match when={formType() === "newsletter"}>
						<Newsletter.Form
							class="flex flex-col items-start gap-2"
							onSubmit={handleNewsletterSubmit}>
							<Newsletter.Field name="name">
								{(field, props) => (
									<>
										<label for="name">Name</label>
										<input
											{...props}
											type="name"
											class={input}
										/>
										{field.error && (
											<div>{field.error}</div>
										)}
									</>
								)}
							</Newsletter.Field>
							<Newsletter.Field
								name="email"
								validate={[
									required("Du musst eine E-Mail angeben"),
								]}>
								{(field, props) => (
									<>
										<label for="email">E-Mail</label>
										<input
											{...props}
											type="email"
											class={input}
										/>
										{field.error && (
											<div>{field.error}</div>
										)}
									</>
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
					<Match when={formType() === "signup"}>
						<p>Noch nicht verfügbar</p>
						{/* <SignUp.Form
							class="flex flex-col items-start gap-2"
							onSubmit={handleSignUpSubmit}>
							<SignUp.Field name="name">
								{(field, props) => (
									<>
										<label for="name">Name</label>
										<input
											{...props}
											type="text"
											class={input}
										/>
									</>
								)}
							</SignUp.Field>
							<SignUp.Field
								name="email"
								validate={[
									required("Du musst eine E-Mail angeben"),
								]}>
								{(field, props) => (
									<>
										<label for="email">E-Mail</label>
										<input
											{...props}
											type="email"
											class={input}
										/>
									</>
								)}
							</SignUp.Field>
							<SignUp.Field
								name="password"
								validate={[
									required("Du musst ein Passwort angeben"),
								]}>
								{(field, props) => (
									<>
										<label for="password">Passwort</label>
										<input
											{...props}
											type="password"
											class={input}
										/>
									</>
								)}
							</SignUp.Field>
							<button
								type="submit"
								class={button({
									intent: "green",
									size: "small",
								})}>
								Join the crew
							</button>
						</SignUp.Form> */}
					</Match>
				</Switch>
			</Show>
		</div>
	)
}
