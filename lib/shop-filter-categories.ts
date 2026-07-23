import { FOOD_DRINK_TAGS, SHOP_TAG_LABELS, type ShopTag } from "./constants";

export type ShopFilterCategory = {
  label: string;
  tags: readonly ShopTag[];
};

export const RETAIL_FILTER_CATEGORIES: ShopFilterCategory[] = [
  {
    label: "Character goods",
    tags: [
      "monchhichi",
      "sanrio",
      "smiski",
      "sonny_angel",
      "sylvanian_families",
      "mofusand",
      "miffy",
      "disney",
      "chiikawa",
      "cartoon",
      "jellycat",
      "studio_ghibli",
    ],
  },
  {
    label: "Try your luck",
    tags: ["blind_boxes", "gachas", "ichiban_kuji"],
  },
  {
    label: "Japanese pop culture",
    tags: ["anime_goods", "fashion", "gundam", "manga"],
  },
  {
    label: "Other",
    tags: ["artist_goods", "photo_booths", "lifestyle", "cosmetics"],
  },
];

/** Category order for display: food & drink, then retail filter groups. */
const TAG_CATEGORY_ORDER: readonly (readonly ShopTag[])[] = [
  FOOD_DRINK_TAGS,
  ...RETAIL_FILTER_CATEGORIES.map((c) => c.tags),
];

function tagCategoryIndex(tag: ShopTag): number {
  const index = TAG_CATEGORY_ORDER.findIndex((tags) => tags.includes(tag));
  return index === -1 ? TAG_CATEGORY_ORDER.length : index;
}

/** Sort tags by category, then alphabetically by label within the category. */
export function sortShopTags(tags: readonly ShopTag[]): ShopTag[] {
  return [...tags].sort((a, b) => {
    const catDiff = tagCategoryIndex(a) - tagCategoryIndex(b);
    if (catDiff !== 0) return catDiff;
    return SHOP_TAG_LABELS[a].localeCompare(SHOP_TAG_LABELS[b], "en");
  });
}
