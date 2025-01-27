import {
	createEffect,
	createSignal,
	onMount,
	Show,
	type VoidComponent,
} from "solid-js"
import type { Event } from "../../content/loaders/payload/pages/getEvents"
import { button } from "../Button.astro"
import { actions } from "astro:actions"
import { ConfettiExplosion } from "solid-confetti-explosion"
import type { User } from "../../actions"
import { navigate } from "astro:transitions/client"
import { Avatars } from "./Avatars"
import { CMS_URL } from "astro:env/client"
import createImageUrl from "../../lib/createImageUrl"

export const Participate: VoidComponent<Event> = (props) => {
	const [event, setEvent] = createSignal<Event>(props)
	const [participating, setParticipating] = createSignal(false)
	const [user, setUser] = createSignal<User | undefined>()
	const [userAction, setUserAction] = createSignal(false)

	onMount(async () => {
		// Load Event
		const eventRes = await actions.getEventById({ id: event().id })
		if (eventRes.error) {
			console.error(eventRes.error)
			return
		}
		setEvent(eventRes.data?.event!)

		const userRes = await actions.verify({})
		if (userRes.error) {
			console.error(userRes.error)
			return
		}
		setUser(userRes.data)

		if (eventRes.data?.isParticipating) {
			setParticipating(true)
		}

		console.log("User", user())
	})

	async function participate(e: MouseEvent) {
		const tempUser = user()
		if (!tempUser) {
			navigate("/login")
			console.error("No user found")
			return
		}
		setParticipating(true)
		setEvent({
			...event(),
			attendees: [...event().attendees!, tempUser],
		})

		await actions.attendEvent({ id: parseInt(event().id) })
	}

	async function cancelParticipation() {
		const tempUser = user()
		setParticipating(false)

		await actions.cancelEvent({ id: parseInt(event().id) })
	}

	// TODO:
	// - Implement Participate and Cancel Participation actions
	// - Error state

	return (
		<div class="flex items-center gap-4">
			<Show when={!participating()}>
				<button
					class={button({ size: "small", intent: "green" })}
					onClick={participate}>
					Teilnehmen
					{/* <Icon name="ph:calendar-heart" /> */}
				</button>
			</Show>
			<Show when={participating()}>
				<ConfettiExplosion
					colors={[
						"#002922",
						"#338073",
						"#EB742F",
						"#FF8640",
						"#F1FF86",
						"#E3FF0C",
					]}
					class="absolute"
				/>
				<div class="flex flex-row gap-2">
					<img
						src={
							user()?.profileImage
								? createImageUrl(user()!.profileImage!.url)
								: "/Profile.png"
						}
						alt={user()?.name}
						class="h-8 w-8 rounded-full"
					/>
					<p>Du nimmst teil!</p>
				</div>

				<button
					onClick={cancelParticipation}
					class="ml-auto h-[44px] cursor-pointer rounded-full bg-transparent px-4 text-green-black/75 ring-1 ring-black/10 hover:text-green-black hover:ring-black/30">
					Teilnahme absagen
				</button>
			</Show>
		</div>
	)
}
