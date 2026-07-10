export type MarkerTone = "shop" | "shop-selected" | "event" | "event-selected";

const MARKER_COLORS: Record<MarkerTone, string> = {
  shop: "#A8D8FF",
  "shop-selected": "#E53935",
  event: "#E86F3A",
  "event-selected": "#C44F1F",
};

export function markerSize(selected: boolean): number {
  return selected ? 40 : 34;
}

export function markerColor(tone: MarkerTone): string {
  return MARKER_COLORS[tone];
}
