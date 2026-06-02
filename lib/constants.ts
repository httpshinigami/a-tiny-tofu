export const SHOP_TAGS = [
  "monchhichi",
  "desserts",
  "brunch",
  "smiskis",
] as const;

export type ShopTag = (typeof SHOP_TAGS)[number];

export const SHOP_TAG_LABELS: Record<ShopTag, string> = {
  monchhichi: "Monchhichi",
  desserts: "Desserts",
  brunch: "Brunch",
  smiskis: "Smiskis",
};

export const TAG_COLORS: Record<ShopTag, string> = {
  monchhichi: "#FFB8D0",
  desserts: "#FFE9A8",
  brunch: "#B8F0D8",
  smiskis: "#A8D8FF",
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
