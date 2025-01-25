import { createEffect, createSignal, onMount, Show, type VoidComponent } from "solid-js";
import type { Event } from "../../content/loaders/payload/pages/getEvents";
import { button } from "../Button.astro";
import { actions } from "astro:actions";
import { ConfettiExplosion } from 'solid-confetti-explosion';
import type { User } from "../../actions";

export const Participate: VoidComponent<Event> = (props) => {
    const [event, setEvent] = createSignal<Event>(props);
    const [participating, setParticipating] = createSignal(false);
    const [user, setUser] = createSignal<User | undefined>();

    onMount(async () => {
        // Load Event
        const eventRes = await actions.getEventById({id: event().id});
        if (eventRes.error) {
            console.error(eventRes.error);
            return;
        }
        setEvent(eventRes.data);

        const userRes = await actions.verify({})
        if (userRes.error) {
            console.error(userRes.error);
            return;
        }
        setUser(userRes.data);
        console.log(user())
    })

    function userToAttendee(user: User) {
        return {
            id: user.id.toString(),
            name: user.name,
            profileImage: user.profileImage
        }
    }

    function participate(e: MouseEvent) {

        const tempUser = user();
        if (!tempUser) {
            console.error("No user found");
            return;
        }
        setParticipating(true);
        setEvent({...event(), attendees: [...event().attendees!, userToAttendee(tempUser)]});
        // actions.participate({id: event().id});
    }

    function cancelParticipation() {
        const tempUser = user();
        setParticipating(false);
        setEvent({...event(), attendees: event().attendees!.filter(attendee => attendee.id !== tempUser?.id.toString())});
        // actions.cancelParticipation({id: event().id});
    }

    // TODO: 
    // - Implement Participate and Cancel Participation actions
    // - Error state
    // - Login redirect
    // - Show attendee Avatars

    return (
        <div class="flex items-center gap-4">
            <Show when={!participating()}>
                <button class={button({size: "small", intent: "green"})} onClick={participate}>
                    Teilnehmen
                    {/* <Icon name="ph:calendar-heart" /> */}
                </button>
                <div>
                    {
                        event().attendees && event().attendees!.length > 0 ? (
                            <p>{event().attendees?.length} Personen nehmen teil</p>
                        ) : (
                            <p>Sei die erste Person, die teilnimmt</p>
                        )
                    }
                </div>
            </Show>
            <Show when={participating()}>
                <ConfettiExplosion colors={["#002922","#338073","#EB742F","#FF8640","#F1FF86","#E3FF0C"]} class="absolute" />
                <p>Du und {(event().attendees?.length || 0)- 1} weitere Personen nehmen teil</p>
                <button onClick={cancelParticipation}>Teilnahme absagen</button>
            </Show>
        </div>

    )
}