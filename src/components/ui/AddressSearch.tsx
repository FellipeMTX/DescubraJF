import { useState, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
};

type AddressData = {
  endereco: string;
  bairro: string;
  latitude: string;
  longitude: string;
};

type AddressSearchProps = {
  onSelect: (data: AddressData) => void;
};

export function AddressSearch({ onSelect }: AddressSearchProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleOpen() {
    setQuery("");
    setResults([]);
    setDialogOpen(true);
  }

  function handleChange(value: string) {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: `${value}, Juiz de Fora, MG`,
          format: "json",
          addressdetails: "1",
          limit: "5",
          countrycodes: "br",
        });

        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          headers: { "Accept-Language": "pt-BR" },
        });

        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  function handleSelect(result: NominatimResult) {
    const addr = result.address;
    const street = [addr.road, addr.house_number].filter(Boolean).join(", ");

    onSelect({
      endereco: street || result.display_name.split(",")[0],
      bairro: addr.suburb ?? "",
      latitude: parseFloat(result.lat).toFixed(6),
      longitude: parseFloat(result.lon).toFixed(6),
    });

    setDialogOpen(false);
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="flex-1" onClick={handleOpen}>
        <Search size={14} /> Buscar endereço
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buscar endereço</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <input
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
              placeholder="Digite rua, número ou local..."
              autoFocus
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 pr-10 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </div>
          </div>

          {results.length > 0 && (
            <div className="max-h-64 overflow-y-auto rounded-lg border">
              {results.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                  <span className="text-gray-700">{r.display_name}</span>
                </button>
              ))}
            </div>
          )}

          {query.length >= 3 && !loading && results.length === 0 && (
            <p className="text-center text-sm text-gray-400">Nenhum resultado encontrado.</p>
          )}

          <p className="text-[10px] text-gray-400">
            Dados: OpenStreetMap / Nominatim
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
