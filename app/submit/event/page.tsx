import { SubmitHub } from "@/components/forms/SubmitHub";
import { PageFrame } from "@/components/layout/PageFrame";

export const metadata = { title: "Submit" };

export default function SubmitEventPage() {
  return (
    <PageFrame>
      <SubmitHub activeType="event" />
    </PageFrame>
  );
}
