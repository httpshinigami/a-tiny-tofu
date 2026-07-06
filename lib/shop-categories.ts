import type { ShopTag } from "./constants";
import type { Shop } from "./types";

export function shopHasAnyTag(
  shop: Shop,
  tags: readonly ShopTag[]
): boolean {
  return shop.shop_tags.some((t) => tags.includes(t));
}

export function filterShopsByTags(
  shops: Shop[],
  tags: readonly ShopTag[]
): Shop[] {
  return shops.filter((shop) => shopHasAnyTag(shop, tags));
}
