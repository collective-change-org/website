import { For, type VoidComponent } from "solid-js"
import type { Event } from "../../content/loaders/payload/pages/getEvents"
import createImageUrl from "../../lib/createImageUrl"

export const Avatars: VoidComponent<{ attendees: Event["attendees"] }> = (
	props,
) => {
	return (
		<div class="flex">
			<For each={props.attendees}>
				{(attendee) => (
					<img
						src={
							attendee.profileImage
								? createImageUrl(attendee.profileImage?.url)
								: "/Profile.png"
						}
						alt={attendee.name}
						class="h-8 w-8 rounded-full"
					/>
				)}
			</For>
		</div>
	)
}
