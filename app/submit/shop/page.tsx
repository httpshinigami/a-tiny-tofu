import { ShopSubmitForm } from "@/components/forms/ShopSubmitForm";
import { PageFrame } from "@/components/layout/PageFrame";

export const metadata = { title: "Submit shop" };

export default function SubmitShopPage() {
  return (
    <PageFrame>
      <h1 className="font-display text-3xl font-bold text-ink">Submit a shop</h1>
      <p className="mt-2 text-ink-muted">
        Know a spot for Monchhichi, cute desserts, brunch, or Smiskis? Tell us!
      </p>
      <div className="mt-8">
        <ShopSubmitForm />
      </div>
    </PageFrame>
  );
}
