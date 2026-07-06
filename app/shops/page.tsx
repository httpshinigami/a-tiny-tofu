import { ShopsExplorer } from "@/components/explorer/ShopsExplorer";
import { RETAIL_SHOP_TAGS } from "@/lib/constants";
import { getApprovedShops } from "@/lib/queries";
import { filterShopsByTags } from "@/lib/shop-categories";

export const metadata = {
  title: "Shops",
};

export default async function ShopsPage() {
  const allShops = await getApprovedShops();
  const shops = filterShopsByTags(allShops, RETAIL_SHOP_TAGS);

  return (
    <ShopsExplorer
      shops={shops}
      filterTags={RETAIL_SHOP_TAGS}
      title="Shops"
      subtitle="Collectibles, character goods, and more — select a spot to zoom the map"
      emptyMessage="No shops match"
    />
  );
}
