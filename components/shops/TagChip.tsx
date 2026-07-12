import {
  SHOP_TAG_LABELS,
  TAG_COLORS,
  type ShopTag,
} from "@/lib/constants";

export function TagChip({ tag }: { tag: ShopTag }) {
  const color = TAG_COLORS[tag];

  return (
    <span
      className="rounded-sm px-2.5 py-1 text-xs font-semibold text-ink"
      style={{ backgroundColor: color }}
    >
      {SHOP_TAG_LABELS[tag]}
    </span>
  );
}
