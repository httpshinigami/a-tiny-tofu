export type MarkerTone = "shop" | "shop-selected" | "event" | "event-selected";

const MARKER_COLORS: Record<MarkerTone, string> = {
  shop: "#A8D8FF",
  "shop-selected": "#6BB8FF",
  event: "#FF8C5A",
  "event-selected": "#E86F3A",
};

export function markerSize(selected: boolean): number {
  return selected ? 36 : 28;
}

export function markerColor(tone: MarkerTone): string {
  return MARKER_COLORS[tone];
}
