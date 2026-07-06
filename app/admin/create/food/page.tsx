import { AdminCreateShopForm } from "@/components/admin/AdminCreateShopForm";
import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { FOOD_DRINK_TAGS } from "@/lib/constants";

export const metadata = { title: "Create food & drink" };

export default function AdminCreateFoodPage() {
  return (
    <PageFrame>
      <KawaiiButton href="/admin" variant="ghost">
        ← Back
      </KawaiiButton>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink">
        Create food & drink spot
      </h1>
      <div className="mt-8">
        <AdminCreateShopForm
          tagOptions={FOOD_DRINK_TAGS}
          tagPrompt="What kind of spot is it?"
          submitLabel="Save food & drink spot"
        />
      </div>
    </PageFrame>
  );
}
