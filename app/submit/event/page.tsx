import { EventSubmitForm } from "@/components/forms/EventSubmitForm";
import { PageFrame } from "@/components/layout/PageFrame";

export const metadata = { title: "Submit event" };

export default function SubmitEventPage() {
  return (
    <PageFrame>
      <h1 className="font-display text-3xl font-bold text-ink">Submit an event</h1>
      <p className="mt-2 text-ink-muted">
        Share a cute market, pop-up, or meet-up. We review every submission before it goes live.
      </p>
      <div className="mt-8">
        <EventSubmitForm />
      </div>
    </PageFrame>
  );
}
