import { useState, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleChange(value: string) {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setResults([]);
      setOpen(false);
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
        setOpen(data.length > 0);
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

    setQuery(street || result.display_name.split(",")[0]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700">Buscar endereço</label>
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Digite rua, número ou local..."
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(r)}
              className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
              <span className="line-clamp-2 text-gray-700">{r.display_name}</span>
            </button>
          ))}
          <p className="border-t px-3 py-1.5 text-[10px] text-gray-400">
            Dados: OpenStreetMap / Nominatim
          </p>
        </div>
      )}
    </div>
  );
}
