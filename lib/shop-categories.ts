import type { ShopTag } from "./constants";
import type { Shop } from "./types";

export function shopHasAnyTag(
  shop: Shop,
  tags: readonly ShopTag[]
): boolean {
  return shop.shop_tags.some((t) => tags.includes(t));
}

export function shopHasAllTags(
  shop: Shop,
  tags: readonly ShopTag[]
): boolean {
  if (!tags.length) return true;
  return tags.every((t) => shop.shop_tags.includes(t));
}

export function filterShopsByTags(
  shops: Shop[],
  tags: readonly ShopTag[]
): Shop[] {
  return shops.filter((shop) => shopHasAnyTag(shop, tags));
}

export function filterShopsByAllTags(
  shops: Shop[],
  tags: readonly ShopTag[]
): Shop[] {
  if (!tags.length) return shops;
  return shops.filter((shop) => shopHasAllTags(shop, tags));
}
