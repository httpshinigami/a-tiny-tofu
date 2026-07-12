import { EventsExplorer } from "@/components/explorer/EventsExplorer";
import { getApprovedEvents } from "@/lib/queries";
import { getCurrentYear } from "@/lib/group-by-month";

export const metadata = {
  title: "Events",
};

export default async function EventsPage() {
  const year = getCurrentYear();
  const allEvents = await getApprovedEvents();
  const events = allEvents.filter(
    (e) => new Date(e.start_at).getFullYear() === year
  );

  return <EventsExplorer events={events} />;
}
