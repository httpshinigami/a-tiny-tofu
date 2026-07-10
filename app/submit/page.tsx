import { SubmitLanding } from "@/components/forms/SubmitLanding";
import { PageFrame } from "@/components/layout/PageFrame";
import { FOOD_DRINK_TAGS, RETAIL_SHOP_TAGS } from "@/lib/constants";
import { getPendingEvents, getPendingShops } from "@/lib/queries";
import { filterShopsByTags } from "@/lib/shop-categories";

export const metadata = {
  title: "Submit your hidden gem",
};

export default async function SubmitPage() {
  const [pendingEvents, pendingShops] = await Promise.all([
    getPendingEvents(),
    getPendingShops(),
  ]);

  const pendingRetail = filterShopsByTags(pendingShops, RETAIL_SHOP_TAGS);
  const pendingFood = filterShopsByTags(pendingShops, FOOD_DRINK_TAGS);

  return (
    <PageFrame>
      <SubmitLanding
        pendingEvents={pendingEvents}
        pendingShops={pendingRetail}
        pendingFood={pendingFood}
      />
    </PageFrame>
  );
}
