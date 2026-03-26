import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export type MapItem = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type InteractiveMapProps = {
  items: MapItem[];
  activeId: string | null;
  center: LatLngExpression;
  zoom?: number;
  className?: string;
};

function FlyToActive({ items, activeId }: { items: MapItem[]; activeId: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (!activeId) return;
    const item = items.find((i) => i.id === activeId);
    if (item) {
      map.flyTo([item.lat, item.lng], 16, { duration: 0.8 });
    }
  }, [activeId, items, map]);

  return null;
}

export function InteractiveMap({
  items,
  activeId,
  center,
  zoom = 13,
  className = "h-80 w-full rounded-xl",
}: InteractiveMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToActive items={items} activeId={activeId} />
      {items.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
          opacity={activeId === null || activeId === item.id ? 1 : 0.4}
        >
          <Popup>{item.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
