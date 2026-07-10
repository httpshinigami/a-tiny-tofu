import type { ShopTag } from "./constants";

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
