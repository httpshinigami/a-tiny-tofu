export type MarkerTone = "shop" | "shop-selected" | "event" | "event-selected";

const MARKER_COLORS: Record<MarkerTone, string> = {
  shop: "#4a3f38",
  "shop-selected": "#c9899a",
  event: "#4a3f38",
  "event-selected": "#c9899a",
};

export function markerSize(selected: boolean): number {
  return selected ? 40 : 34;
}

export function markerColor(tone: MarkerTone): string {
  return MARKER_COLORS[tone];
}
