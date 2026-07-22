import { EventsExplorer } from "@/components/explorer/EventsExplorer";
import { getApprovedEvents } from "@/lib/queries";

export const metadata = {
  title: "Events",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const { focus } = await searchParams;
  const events = await getApprovedEvents();

  return <EventsExplorer events={events} initialFocusId={focus ?? null} />;
}
