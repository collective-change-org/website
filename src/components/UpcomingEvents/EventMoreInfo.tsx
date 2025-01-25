import type { VoidComponent } from "solid-js";
import type { Event } from "../../content/loaders/payload/pages/getEvents"


export const EventMoreInfo: VoidComponent<Event> = (props) => {
    return <div class="w-full border-t-2 border-t-green-black/30 border-dashed py-2">
        <div class="flex px-5">
            <p class="font-sans text-base text-green-black">Mehr anzeigen</p>
        </div>
    </div>
}