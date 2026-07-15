import { AdminEditShopForm } from "@/components/admin/AdminEditShopForm";
import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RETAIL_SHOP_TAGS } from "@/lib/constants";
import { getShopById } from "@/lib/queries";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit shop" };

export default async function AdminEditShopPage({
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
      <h1 className="mt-4 text-3xl font-bold text-periwinkle">Edit shop</h1>
      <p className="mt-1 text-sm text-ink-muted">{shop.name}</p>
      <div className="mt-8">
        <AdminEditShopForm shop={shop} tagOptions={RETAIL_SHOP_TAGS} />
      </div>
    </PageFrame>
  );
}
