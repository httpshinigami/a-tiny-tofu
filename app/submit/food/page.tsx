import { SubmitHub } from "@/components/forms/SubmitHub";
import { PageFrame } from "@/components/layout/PageFrame";

export const metadata = { title: "Submit food & drink" };

export default function SubmitFoodPage() {
  return (
    <PageFrame>
      <SubmitHub activeType="food" />
    </PageFrame>
  );
}
