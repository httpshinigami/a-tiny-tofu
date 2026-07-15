import { AdminCreateShopForm } from "@/components/admin/AdminCreateShopForm";
import { PageFrame } from "@/components/layout/PageFrame";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RETAIL_SHOP_TAGS } from "@/lib/constants";

export const metadata = { title: "Create shop" };

export default function AdminCreateShopPage() {
  return (
    <PageFrame>
      <KawaiiButton href="/admin" variant="ghost">
        ← Back
      </KawaiiButton>
      <h1 className="mt-4 font-display text-3xl font-bold text-cocoa">Create shop</h1>
      <div className="mt-8">
        <AdminCreateShopForm
          tagOptions={RETAIL_SHOP_TAGS}
          tagPrompt="Tags"
        />
      </div>
    </PageFrame>
  );
}
