import { AdminEditEventForm } from "@/components/admin/AdminEditEventForm";
import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { getEventById } from "@/lib/queries";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit event" };

export default async function AdminEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <PageFrame>
      <KawaiiButton href="/admin" variant="ghost">
        ← Back to dashboard
      </KawaiiButton>
      <h1 className="mt-4 text-3xl font-bold text-periwinkle">Edit event</h1>
      <p className="mt-1 text-sm text-ink-muted">{event.title}</p>
      <div className="mt-8">
        <AdminEditEventForm event={event} />
      </div>
    </PageFrame>
  );
}
