import { useEffect, useMemo, type ReactNode } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type ListingMapItem = {
  id: string;
  slug: string;
  nome: string;
  latitude: number | null;
  longitude: number | null;
  imagem_destaque?: string | null;
  bairro?: string | null;
  badge?: string | null;
};

const JF_CENTER: [number, number] = [-21.7642, -43.3496];

function mapIsVisible(map: L.Map) {
  const size = map.getSize();
  return size.x > 0 && size.y > 0;
}

function hasCoords(i: ListingMapItem): i is ListingMapItem & { latitude: number; longitude: number } {
  return Number.isFinite(i.latitude) && Number.isFinite(i.longitude);
}

function FitBounds({ items }: { items: ListingMapItem[] }) {
  const map = useMap();
  useEffect(() => {
    if (!mapIsVisible(map)) return;
    const coords = items.filter(hasCoords);
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.flyTo([coords[0].latitude, coords[0].longitude], 14, { duration: 0.6 });
      return;
    }
    const bounds = L.latLngBounds(coords.map((i) => [i.latitude, i.longitude]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: true });
  }, [items, map]);
  return null;
}

function FlyToActive({ items, activeId }: { items: ListingMapItem[]; activeId: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!activeId || !mapIsVisible(map)) return;
    const item = items.find((i) => i.id === activeId);
    if (item && hasCoords(item)) {
      map.flyTo([item.latitude, item.longitude], 15, { duration: 0.6 });
    }
  }, [activeId, items, map]);
  return null;
}

type ListingMapProps = {
  items: ListingMapItem[];
  activeId: string | null;
  onMarkerHover: (id: string | null) => void;
  onMarkerClick?: (slug: string) => void;
  renderPopupExtra?: (item: ListingMapItem) => ReactNode;
  ctaLabel: string;
};

export function ListingMap({
  items,
  activeId,
  onMarkerHover,
  onMarkerClick,
  renderPopupExtra,
  ctaLabel,
}: ListingMapProps) {
  const { t } = useTranslation();
  const withCoords = useMemo(() => items.filter(hasCoords), [items]);

  if (withCoords.length === 0) {
    return (
      <div
        className="flex h-full items-center justify-center rounded-[28px] text-sm"
        style={{ background: "var(--color-bl-card)", color: "var(--color-bl-muted)" }}
      >
        {t("common.noMapLocations")}
      </div>
    );
  }

  return (
    <MapContainer
      center={JF_CENTER}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds items={withCoords} />
      <FlyToActive items={withCoords} activeId={activeId} />
      {withCoords.map((item) => {
        const isDim = activeId !== null && activeId !== item.id;
        return (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            opacity={isDim ? 0.4 : 1}
            riseOnHover
            eventHandlers={{
              mouseover: () => onMarkerHover(item.id),
              mouseout: () => onMarkerHover(null),
              click: () => onMarkerClick?.(item.slug),
            }}
          >
            <Popup closeButton offset={[0, -28]} maxWidth={240}>
              <div
                className="lf-popup-img"
                style={{ backgroundImage: `url(${item.imagem_destaque ?? ""})` }}
              />
              <div className="lf-popup-body">
                <p className="t">{item.nome}</p>
                {item.bairro && <div className="l">{item.bairro}</div>}
                <div className="row">
                  {renderPopupExtra ? renderPopupExtra(item) : <span />}
                  <button
                    type="button"
                    onClick={() => onMarkerClick?.(item.slug)}
                    className="lf-popup-cta"
                  >
                    {ctaLabel} →
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
