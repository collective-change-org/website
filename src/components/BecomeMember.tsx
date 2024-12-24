import type { BecomeMemberType } from "../content/loaders/kirby/schemas"
import { createEffect, createSignal, type Component } from "solid-js"
import Dialog from "@corvu/dialog"
import { cn } from "../lib/cn"

interface Props extends BecomeMemberType {
	listmonk_api_key: string
}

export const BecomeMember: Component<Props> = (props) => {
	const [name, setName] = createSignal<string>("")
	const [email, setEmail] = createSignal<string>("")
	const [emailError, setEmailError] = createSignal<string>("")

	const [signupError, setSignupError] = createSignal<string>("")

	createEffect(() => {
		if (email() && emailError()) {
			validateEmail(email())
		}
	})

	async function submitForm() {
		validateEmail(email())
		if (emailError()) return

		await fetch(
			"https://changecollective-mail.woven.design/api/subscribers",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `token starlight:${props.listmonk_api_key}`,
				},
				body: JSON.stringify({
					email: email(),
					name: name(),
					status: "enabled",
					lists: [3],
				}),
			}
		).catch((e) => {
			console.error(e)
			setSignupError(
				"Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
			)
		})
	}

	function validateEmail(email: string) {
		if (!email) {
			setEmailError("Bitte gib eine E-Mail Adresse ein.")
			return
		}
		if (!email.includes("@") || !email.includes(".") || email.length < 5) {
			setEmailError("Die E-Mail Adresse scheint nicht korrekt zu sein.")
			return
		}
		// Check if there are spaces in the email
		if (email.includes(" ")) {
			setEmailError(
				"Die E-Mail Adresse darf keine Leerzeichen enthalten."
			)
			return
		}
		setEmailError("")
	}

	return (
		<div class="flex flex-col gap-4 max-w-md">
			{/* <!-- TODO: Get this text from the CMS --> */}
			Become a member
			<Dialog>
				<Dialog.Trigger class="my-auto rounded-lg bg-indigo-900 px-4 py-3 text-lg font-medium transition-all duration-100 hover:bg-indigo-800 active:translate-y-0.5 cursor-pointer">
					Werde Mitglied
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
					<Dialog.Content
						class="fixed left-1/2 top-1/2 z-50 min-w-[320px] -translate-x-1/2 -translate-y-1/2 
						rounded-lg border-2 border-zinc-700 bg-zinc-800 px-6 py-5 duration-200 flex gap-4 flex-col
						corvu-open:animate-in corvu-open:fade-in-0 corvu-open:zoom-in-95 corvu-open:slide-in-from-left-1/2 corvu-open:slide-in-from-top-[60%] corvu-closed:animate-out corvu-closed:fade-out-0 corvu-closed:zoom-out-95 corvu-closed:slide-out-to-left-1/2 corvu-closed:slide-out-to-top-[60%]">
						<div class="flex flex-col gap-1">
							<label for="name">
								Name{" "}
								<span class="font-bold opacity-50 text-xs uppercase">
									optional
								</span>
							</label>
							<input
								type="text"
								id="name"
								name="name"
								class="rounded-lg px-4 py-2"
								placeholder="z.B. Maxi Muster"
								value={name()}
								onInput={(e) => setName(e.currentTarget.value)}
							/>
						</div>
						<div class="flex flex-col gap-1">
							<label for="email">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								class={cn(
									"rounded-lg px-4 py-2",
									emailError() && "border-2 border-red-700"
								)}
								placeholder="z.B. maxi@musteradresse.de"
								value={email()}
								onInput={(e) => setEmail(e.currentTarget.value)}
							/>
							<p class="text-red-500 text-xs">{emailError()}</p>
						</div>
						<div class="mt-3 flex justify-between gap-2">
							<Dialog.Close class="rounded-md bg-zinc-700 px-3 py-2 cursor-pointer hover:bg-zinc-600">
								Abbrechen
							</Dialog.Close>
							<button
								class="rounded-md bg-indigo-700 px-3 py-2 font-bold cursor-pointer hover:bg-indigo-600"
								onClick={submitForm}>
								Werde Teil der Veränderung
							</button>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog>
		</div>
	)
}
