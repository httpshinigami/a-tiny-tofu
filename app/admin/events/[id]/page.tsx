import { AdminEditEventForm } from "@/components/admin/AdminEditEventForm";
import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { getEventById } from "@/lib/queries";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit event" };

export default async function AdminEditEventPage({
  params,
}: {
  //params = “what’s in the URL”, and id = which event you’re editing (/admin/events/some-event-id)

  // Promise is a placeholder variable for the id which it doesn't know the value of yet (So da code is like: we gonna get this data, i promise! )
  // Page is async so id is not known until the page is rendered (code runs and it will either get that data or it will not)
  // (because its async, the code expects the promise to come tru , but if it doesnt then das ogai... promise broken)
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  // If event not found, show 404 page
  if (!event) notFound();

  return (
    <PageFrame>
      <KawaiiButton href="/admin" variant="ghost">
        ← Back to dashboard
      </KawaiiButton>
      <h1 className="mt-4 text-3xl font-bold text-cocoa">Edit event</h1>
      <p className="mt-1 text-sm text-ink-muted">{event.title}</p>
      <div className="mt-8">
        <AdminEditEventForm event={event} />
      </div>
    </PageFrame>
  );
}
