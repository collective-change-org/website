import Disclosure from "@corvu/disclosure"
import type { VoidComponent } from "solid-js"
import type { Event } from "../../content/loaders/payload/pages/getEvents"

export const EventMoreInfo: VoidComponent<Event> = (props) => {
	return (
		<div class="w-full border-t-2 border-dashed border-t-green-black/30">
			<Disclosure collapseBehavior="hide">
				{(props) => (
					<>
						<Disclosure.Trigger class="flex w-full cursor-pointer bg-transparent px-5 py-2">
							{props.expanded && (
								<>
									<p class="font-sans text-base text-green-black">
										Weniger anzeigen
									</p>
								</>
							)}
							{!props.expanded && (
								<>
									<p class="font-sans text-base text-green-black">
										Mehr anzeigen
									</p>
								</>
							)}
						</Disclosure.Trigger>
						<Disclosure.Content class="corvu-expanded:animate-expand corvu-collapsed:animate-collapse mt-1 space-y-1 overflow-hidden px-5 pb-2">
							Haha infos
						</Disclosure.Content>
					</>
				)}
			</Disclosure>
		</div>
	)
}
