import { ShopsExplorer } from "@/components/explorer/ShopsExplorer";
import { FOOD_DRINK_TAGS } from "@/lib/constants";
import { getApprovedShops } from "@/lib/queries";
import { filterShopsByTags } from "@/lib/shop-categories";

export const metadata = {
  title: "Food & Drink",
};

export default async function FoodPage() {
  const allShops = await getApprovedShops();
  const shops = filterShopsByTags(allShops, FOOD_DRINK_TAGS);

  return (
    <ShopsExplorer
      shops={shops}
      filterTags={FOOD_DRINK_TAGS}
      title="Food & Drink"
      subtitle="Desserts, drinks, restaurants, and Asian marts — select a spot to zoom the map"
      emptyMessage="No food & drink spots match"
      filterOpenByDefault
    />
  );
}
