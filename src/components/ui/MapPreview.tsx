import { useState } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import "leaflet/dist/leaflet.css";

type MapPreviewProps = {
  latitude: string;
  longitude: string;
};

export function MapPreview({ latitude, longitude }: MapPreviewProps) {
  const [open, setOpen] = useState(false);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const hasCoords = !isNaN(lat) && !isNaN(lng);

  if (!hasCoords) return null;

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setOpen(true)}>
        <MapPin size={14} /> Ver no mapa
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pré-visualização do mapa</DialogTitle>
          </DialogHeader>
          <div className="h-64 w-full overflow-hidden rounded-lg">
            <MapContainer
              center={[lat, lng]}
              zoom={16}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]} />
            </MapContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
