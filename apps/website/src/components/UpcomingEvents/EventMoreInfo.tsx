import Disclosure from "@corvu/disclosure";
import type { Component, JSX, VoidComponent } from "solid-js";
import type { Event } from "../../content/loaders/payload/pages/getEvents";
import { cn } from "../../lib/cn";

export const EventMoreInfo: Component<{ children: JSX.Element[] }> = (
	componentProps,
) => {
	return (
		<div>
			<Disclosure collapseBehavior="hide">
				{(props) => (
					<>
						<Disclosure.Content class="space-y-1 overflow-hidden bg-green-dark text-off-white corvu-expanded:animate-expand corvu-collapsed:animate-collapse">
							<div class="p-5">{componentProps.children}</div>
						</Disclosure.Content>
						<div class="p-3">
							<Disclosure.Trigger class="flex w-full h-8 cursor-pointer items-center justify-center rounded bg-transparent bg- px-5 py-2 ring-2 ring-inset ring-black/10">
								<svg
									width="32"
									height="32"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class={cn(
										"text-green-black transition-transform",
										!props.expanded && "rotate-180",
									)}
								>
									<path
										d="M6 20L16 10L26 20"
										stroke="#001A15"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</Disclosure.Trigger>
						</div>
					</>
				)}
			</Disclosure>
		</div>
	);
};
