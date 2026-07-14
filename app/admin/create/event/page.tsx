import { AdminCreateEventForm } from "@/components/admin/AdminCreateEventForm";
import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";

export const metadata = { title: "Create event" };

export default function AdminCreateEventPage() {
  return (
    <PageFrame>
      <KawaiiButton href="/admin" variant="ghost">
        ← Back
      </KawaiiButton>
      <h1 className="mt-4 font-display text-3xl font-bold text-periwinkle">Create event</h1>
      <div className="mt-8">
        <AdminCreateEventForm />
      </div>
    </PageFrame>
  );
}
