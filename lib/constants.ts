export const SHOP_TAGS = [
  "brunch",
  "desserts",
  "photo_booths",
  "artist_goods",
  "anime_goods",
  "monchhichi",
  "blind_boxes",
  "sanrio",
  "smiski",
  "sonny_angel",
  "sylvanian_families",
] as const;

export type ShopTag = (typeof SHOP_TAGS)[number];

export const SHOP_TAG_LABELS: Record<ShopTag, string> = {
  brunch: "Brunch",
  desserts: "Desserts",
  photo_booths: "Photo Booths",
  artist_goods: "Artist Goods",
  anime_goods: "Anime Goods",
  blind_boxes: "Blind Boxes",
  monchhichi: "Monchhichi",
  sanrio: "Sanrio/San-X",
  smiski: "Smiski",
  sonny_angel: "Sonny Angel",
  sylvanian_families: "Sylvanian Families",
};

export const TAG_COLORS: Record<ShopTag, string> = {
  brunch: "#FFE9A8",
  desserts: "#FFE9A8",
  photo_booths: "#A8FFD8",
  artist_goods: "#D8A8FF",
  anime_goods: "#FFA8D8",
  blind_boxes: "#D8FFA8",
  monchhichi: "#D8FFA8",
  sanrio: "#D8FFA8",
  smiski: "#D8FFA8",
  sonny_angel: "#D8FFA8",
  sylvanian_families: "#D8FFA8",
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
