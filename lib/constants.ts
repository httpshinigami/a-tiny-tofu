export const SHOP_TAGS = [
  "desserts",
  "drinks",
  "restaurant",
  "fashion",
  "photo_booths",
  "artist_goods",
  "lifestyle",
  "anime_goods",
  "manga",
  "gundam",
  "blind_boxes",
  "gachas",
  "ichiban_kuji",
  "cartoon",
  "chiikawa",
  "disney",
  "jellycat",
  "miffy",
  "mofusand",
  "monchhichi",
  "sanrio",
  "smiski",
  "sonny_angel",
  "studio_ghibli",
  "sylvanian_families",
] as const;

export type ShopTag = (typeof SHOP_TAGS)[number];

export const FOOD_DRINK_TAGS = [
  "desserts",
  "drinks",
  "restaurant",
] as const satisfies readonly ShopTag[];

export type FoodDrinkTag = (typeof FOOD_DRINK_TAGS)[number];

export const RETAIL_SHOP_TAGS = [
  "fashion",
  "photo_booths",
  "artist_goods",
  "lifestyle",
  "anime_goods",
  "manga",
  "gundam",
  "blind_boxes",
  "gachas",
  "ichiban_kuji",
  "cartoon",
  "chiikawa",
  "disney",
  "jellycat",
  "miffy",
  "mofusand",
  "monchhichi",
  "sanrio",
  "smiski",
  "sonny_angel",
  "studio_ghibli",
  "sylvanian_families",
] as const satisfies readonly ShopTag[];

export type RetailShopTag = (typeof RETAIL_SHOP_TAGS)[number];

export const SHOP_TAG_LABELS: Record<ShopTag, string> = {
  desserts: "Desserts",
  drinks: "Drinks",
  restaurant: "Restaurant",
  fashion: "Fashion",
  photo_booths: "Photo Booths",
  artist_goods: "Artist Goods",
  lifestyle: "Lifestyle",
  anime_goods: "Anime Goods",
  manga: "Manga",
  gundam: "Gundam",
  blind_boxes: "Blind Boxes",
  gachas: "Gachas",
  ichiban_kuji: "Ichiban Kuji",
  cartoon: "Cartoon",
  chiikawa: "Chiikawa",
  disney: "Disney",
  jellycat: "Jellycat",
  miffy: "Miffy",
  mofusand: "Mofusand",
  monchhichi: "Monchhichi",
  sanrio: "Sanrio/San-X",
  studio_ghibli: "Studio Ghibli",
  smiski: "Smiski",
  sonny_angel: "Sonny Angel",
  sylvanian_families: "Sylvanian Families",
};

export const TAG_COLORS: Record<ShopTag, string> = {
  desserts: "#F5E8DD",
  drinks: "#F5E8DD",
  restaurant: "#F5E8DD",
  fashion: "#E8C4D4",
  photo_booths: "#CCD3CA",
  artist_goods: "#D8A8FF",
  anime_goods: "#FFA8D8",
  manga: "#FFA8D8",
  gundam: "#A8C4E8",
  blind_boxes: "#B5C0D0",
  gachas: "#B5C0D0",
  ichiban_kuji: "#B5C0D0",
  monchhichi: "#EED3D9",
  sanrio: "#EED3D9",
  smiski: "#EED3D9",
  sonny_angel: "#EED3D9",
  sylvanian_families: "#EED3D9",
  mofusand: "#EED3D9",
  miffy: "#EED3D9",
  disney: "#EED3D9",
  chiikawa: "#EED3D9",
  cartoon: "#EED3D9",
  jellycat: "#EED3D9",
  studio_ghibli: "#EED3D9",
  lifestyle: "#CCD3CA",
};

export const MELBOURNE_CENTER = { lat: -37.8136, lng: 144.9631 } as const;

export const STATUS = ["pending", "approved", "rejected"] as const;
export type Status = (typeof STATUS)[number];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
