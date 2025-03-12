import {
	createEffect,
	createSignal,
	onMount,
	Show,
	type VoidComponent,
} from "solid-js";
import type { Event } from "../../content/loaders/payload/pages/getEvents";
import { button } from "../button/button";
import { actions } from "astro:actions";
import { ConfettiExplosion } from "solid-confetti-explosion";
import type { User } from "../../actions";
import { navigate } from "astro:transitions/client";
import { CMS_URL } from "astro:env/client";
import { createImageUrl } from "../../lib/createImageUrl";
import { Spinner } from "./Spinner";

interface ParticipateProps extends Event {
	eventContent: string;
}

export const Participate: VoidComponent<ParticipateProps> = (props) => {
	const [event, setEvent] = createSignal<Event>(props);
	const [participating, setParticipating] = createSignal(false);
	const [user, setUser] = createSignal<User | undefined>();
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal<string>();

	onMount(async () => {
		const userRes = await actions.verify({});
		if (userRes.error) {
			console.error(userRes.error);
			return;
		}
		setUser(userRes.data);
		console.log(event().attendees, userRes.data?.id);

		const participating = event().attendees?.some(
			(attendee) => attendee === userRes.data?.id,
		);

		if (participating) {
			setParticipating(true);
		}

		// Check if participate query is in URL
		const urlParams = new URLSearchParams(window.location.search);
		const participateQuery = urlParams.get("participate");

		console.log(urlParams);

		if (participateQuery === event().id.toString()) {
			participate();
		}
	});

	async function participate() {
		const tempUser = user();
		if (!tempUser) {
			// Add Local Storage to redirect to event after login
			const afterLoginAction = {
				redirect: "/",
				participate: event().id,
			};

			localStorage.setItem(
				"afterLoginAction",
				JSON.stringify(afterLoginAction),
			);

			navigate("/login");
			console.error("No user found");
			return;
		}
		setLoading(true);
		setEvent({
			...event(),
			attendees: [...event().attendees!, tempUser.id],
		});

		const { data, error } = await actions.attendEvent({
			id: event().id,
		});
		setLoading(false);
		if (error) {
			console.error(error);
			setError(
				error.message === "Conflict"
					? "Du nimmst bereits teil!"
					: error.message,
			);
			return;
		}
		setParticipating(true);
	}

	async function cancelParticipation() {
		setLoading(true);

		const { data, error } = await actions.cancelEvent({
			id: event().id,
		});
		setLoading(false);
		if (error) {
			console.error(error);
			setError(error.message);
			return;
		}
		setParticipating(false);
	}

	return (
		<div class="flex flex-col gap-2">
			<div class="flex flex-row flex-wrap items-center gap-4 justify-between">
				<Show when={!participating()}>
					<button
						class={button({ size: "small", intent: "green" })}
						onClick={participate}
					>
						<Show
							when={!loading()}
							fallback={<Spinner class="fill-off-white" />}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								viewBox="0 0 256 256"
							>
								<path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V208ZM152,88a31.91,31.91,0,0,0-24,10.86A32,32,0,0,0,72,120c0,36.52,50.28,62.08,52.42,63.16a8,8,0,0,0,7.16,0C133.72,182.08,184,156.52,184,120A32,32,0,0,0,152,88Zm-24,78.93c-13.79-7.79-40-26.75-40-46.93a16,16,0,0,1,32,0,8,8,0,0,0,16,0,16,16,0,0,1,32,0C168,140.19,141.79,159.15,128,166.93Z">
								</path>
							</svg>
							<Show
								when={user()}
								fallback="Einloggen und Teilnehmen"
							>
								Teilnehmen
							</Show>
						</Show>
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
					<button
						onClick={cancelParticipation}
						class="flex h-[44px] cursor-pointer items-center gap-2 rounded-full bg-transparent px-4 text-green-black/75 ring-1 ring-black/10 hover:text-green-black hover:ring-black/30"
					>
						<Show when={!loading()} fallback={<Spinner />}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								viewBox="0 0 256 256"
							>
								<path d="M53.92,34.62A8,8,0,0,0,48,32,16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a8,8,0,0,0,5.92-13.38ZM73.55,80H48V51.88ZM48,208V96H88.1L189.92,208ZM224,48V177.23a8,8,0,1,1-16,0V96H134.88a8,8,0,0,1,0-16H208V48H184v8a8,8,0,0,1-16,0V48H91.25a8,8,0,0,1,0-16H168V24a8,8,0,0,1,16,0v8h24A16,16,0,0,1,224,48Z">
								</path>
							</svg>
							Teilnahme absagen
						</Show>
					</button>
				</Show>
				<a
					href={`data:text/calendar;charset=utf-8,${
						encodeURIComponent(props.eventContent)
					}`}
					download={`${props.title}.ics`}
					class="typestyle-text-xs tracking-wider text-black uppercase"
				>
					Zum Kalender hinzufügen
				</a>
			</div>
			<Show when={error()}>
				<p class="text-orange-dark">{error()}</p>
			</Show>
		</div>
	);
};
