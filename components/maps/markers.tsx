import L from "leaflet";

function createMarkerIcon(color: string, size: number) {
  return L.divIcon({
    className: "kawaii-marker",
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 2px solid #3d3429;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(61,52,41,0.25);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export const EVENT_MARKER = createMarkerIcon("#FF8C5A", 28);
export const SELECTED_EVENT_MARKER = createMarkerIcon("#E86F3A", 36);
export const SHOP_MARKER = createMarkerIcon("#A8D8FF", 28);
export const SELECTED_SHOP_MARKER = createMarkerIcon("#6BB8FF", 36);
