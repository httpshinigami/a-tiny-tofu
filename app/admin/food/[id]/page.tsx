import { AdminEditShopForm } from "@/components/admin/AdminEditShopForm";
import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { FOOD_DRINK_TAGS } from "@/lib/constants";
import { getShopById } from "@/lib/queries";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit food & drink" };

export default async function AdminEditFoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = await getShopById(id);
  // If shop not found, show 404 page
  if (!shop) notFound();

  return (
    <PageFrame>
      <KawaiiButton href="/admin" variant="ghost">
        ← Back to dashboard
      </KawaiiButton>
      <h1 className="mt-4 font-display text-3xl font-bold text-cocoa">
        Edit food & drink spot
      </h1>
      <p className="mt-1 text-sm text-ink-muted">{shop.name}</p>
      <div className="mt-8">
        <AdminEditShopForm
          shop={shop}
          tagOptions={FOOD_DRINK_TAGS}
          tagPrompt="What kind of spot is it?"
          deleteConfirmMessage="Delete this food & drink spot permanently?"
        />
      </div>
    </PageFrame>
  );
}
