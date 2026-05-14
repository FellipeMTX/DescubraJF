import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Hospedagem } from "@/types/database";

type LodgingMapProps = {
  items: Hospedagem[];
  activeId: string | null;
  onMarkerHover: (id: string | null) => void;
  onMarkerClick?: (slug: string) => void;
};

const JF_CENTER: [number, number] = [-21.7642, -43.3496];

function buildMarkerIcon(name: string, state: "default" | "active" | "dim"): L.DivIcon {
  const cls = `lf-marker${state === "active" ? " active" : ""}${state === "dim" ? " dim" : ""}`;
  return L.divIcon({
    html: `<div class="${cls}">${escapeHtml(name)}</div>`,
    className: "",
    iconSize: undefined,
    iconAnchor: [0, 0],
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c
  );
}

function FitBounds({ items }: { items: Hospedagem[] }) {
  const map = useMap();
  useEffect(() => {
    const coords = items.filter((i) => i.latitude && i.longitude);
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.flyTo([coords[0].latitude!, coords[0].longitude!], 14, { duration: 0.6 });
      return;
    }
    const bounds = L.latLngBounds(coords.map((i) => [i.latitude!, i.longitude!]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: true });
  }, [items, map]);
  return null;
}

function FlyToActive({ items, activeId }: { items: Hospedagem[]; activeId: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!activeId) return;
    const item = items.find((i) => i.id === activeId);
    if (item && item.latitude && item.longitude) {
      map.flyTo([item.latitude, item.longitude], 15, { duration: 0.6 });
    }
  }, [activeId, items, map]);
  return null;
}

export function LodgingMap({ items, activeId, onMarkerHover, onMarkerClick }: LodgingMapProps) {
  const { t } = useTranslation();
  const withCoords = useMemo(() => items.filter((i) => i.latitude && i.longitude), [items]);

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
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
        maxZoom={19}
      />
      <FitBounds items={withCoords} />
      <FlyToActive items={withCoords} activeId={activeId} />
      {withCoords.map((item) => {
        const state: "default" | "active" | "dim" =
          activeId === item.id ? "active" : activeId ? "dim" : "default";
        return (
          <Marker
            key={item.id}
            position={[item.latitude!, item.longitude!]}
            icon={buildMarkerIcon(item.nome, state)}
            riseOnHover
            eventHandlers={{
              mouseover: () => onMarkerHover(item.id),
              mouseout: () => onMarkerHover(null),
              click: () => onMarkerClick?.(item.slug),
            }}
          >
            <Popup closeButton offset={[0, -28]} maxWidth={240}>
              <div className="lf-popup-img" style={{ backgroundImage: `url(${item.imagem_destaque ?? ""})` }} />
              <div className="lf-popup-body">
                <p className="t">{item.nome}</p>
                {item.bairro && <div className="l">{item.bairro}</div>}
                <div className="row">
                  {item.estrelas ? (
                    <span className="stars">{"★".repeat(item.estrelas)}{"☆".repeat(Math.max(0, 5 - item.estrelas))}</span>
                  ) : <span />}
                  <button
                    type="button"
                    onClick={() => onMarkerClick?.(item.slug)}
                    className="lf-popup-cta"
                  >
                    {t("lodging.list.viewDetails")} →
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
