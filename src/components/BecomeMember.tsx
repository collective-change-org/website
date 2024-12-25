import type { BecomeMemberType } from "../content/loaders/kirby/schemas"
import { createEffect, createSignal, Show, type Component } from "solid-js"
import Dialog from "@corvu/dialog"
import { cn } from "../lib/cn"

interface Props extends BecomeMemberType {
	listmonk_api_key: string
	listmonk_api: string
}

export const BecomeMember: Component<Props> = (props) => {
	const [name, setName] = createSignal<string>("")
	const [email, setEmail] = createSignal<string>("")
	const [emailError, setEmailError] = createSignal<string>("")

	const [signupError, setSignupError] = createSignal<string>("")

	const [submitting, setSubmitting] = createSignal<boolean>(false)

	createEffect(() => {
		if (email() && emailError()) {
			validateEmail(email())
		}
	})

	async function submitForm() {
		validateEmail(email())
		if (emailError()) return

		const apiURL = new URL(props.listmonk_api)

		setSignupError("")
		setSubmitting(true)

		await fetch(`${apiURL.origin}/api/subscribers`, {
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
		})
			.catch((e) => {
				setSubmitting(false)
				console.error(e)
				setSignupError(
					"Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
				)
			})
			.then(async (res) => {
				setSubmitting(false)
				console.log(res)
				if (res instanceof Response) {
					if (res.status !== 200) {
						const body = await res.json()
						setSignupError(body.message)
						return
					}
					console.log("Success")
				} else {
					setSignupError(
						"Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
					)
				}
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
								<Show
									when={submitting()}
									fallback="Werde Teil der Veränderung">
									<div role="status">
										<svg
											aria-hidden="true"
											class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="currentFill"
											/>
										</svg>
										<span class="sr-only">Loading...</span>
									</div>
								</Show>
							</button>
						</div>
						<Show when={signupError()}>
							<p class="text-red-500 text-xs mt-3">
								{signupError()}
							</p>
						</Show>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog>
		</div>
	)
}
