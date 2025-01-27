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
		setEvent(eventRes.data)

		const userRes = await actions.verify({})
		if (userRes.error) {
			console.error(userRes.error)
			return
		}
		setUser(userRes.data)

		// Check if user is participating
		const tempUser = user()
		if (!tempUser) {
			return
		}
		const isParticipating = event().attendees?.some(
			(attendee) => attendee.id === tempUser.id,
		)
		if (isParticipating) {
			setParticipating(true)
		}
	})

	function userToAttendee(user: User) {
		return {
			id: user.id.toString(),
			name: user.name,
			profileImage: user.profileImage,
		}
	}

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
		// actions.participate({id: event().id});
	}

	function cancelParticipation() {
		const tempUser = user()
		setParticipating(false)
		setEvent({
			...event(),
			attendees: event().attendees!.filter(
				(attendee) => attendee.id !== tempUser?.id,
			),
		})
		// actions.cancelParticipation({id: event().id});
	}

	// TODO:
	// - Implement Participate and Cancel Participation actions
	// - Error state
	// - Show attendee Avatars

	return (
		<div class="flex items-center gap-4">
			<Show when={!participating()}>
				<button
					class={button({ size: "small", intent: "green" })}
					onClick={participate}>
					Teilnehmen
					{/* <Icon name="ph:calendar-heart" /> */}
				</button>
				<div>
					<Avatars attendees={event().attendees} />

					{event().attendees && event().attendees!.length > 0 ? (
						<p>{event().attendees?.length} Personen nehmen teil</p>
					) : (
						<p class="uppercase opacity-50">
							Sei die erste Person die Teilnimmt!
						</p>
					)}
				</div>
			</Show>
			<Show when={participating()}>
				<Avatars attendees={event().attendees} />
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
				<Show
					when={
						event().attendees?.length &&
						event().attendees?.length! > 1
					}
					fallback={<p>Aktuell nimmst nur du teil.</p>}>
					<p>
						Du und {(event().attendees?.length || 0) - 1} weitere
						Personen nehmen teil
					</p>
				</Show>

				<button
					onClick={cancelParticipation}
					class="ml-auto h-[44px] cursor-pointer rounded-full bg-transparent px-4 text-green-black/75 ring-1 ring-black/10 hover:text-green-black hover:ring-black/30">
					Teilnahme absagen
				</button>
			</Show>
		</div>
	)
}
