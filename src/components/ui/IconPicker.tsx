import { useState } from "react";
import {
  Hospital, Bus, Shield, MapPin, Phone, Utensils, Hotel, Plane, Train, Car,
  Bike, Ship, Briefcase, Building, Church, Cross, Landmark, Globe, Info,
  Banknote, CreditCard, Scale, Stethoscope, Pill, Siren, BadgeAlert,
  HeartPulse, Accessibility, Eye, Camera, Mountain, Trees, Sun, Umbrella,
  Music, Palette, BookOpen, GraduationCap, ShoppingBag, Store, Coffee,
  Wine, Beer, IceCream, Wifi, CircleParking, Dog, Baby, Users, HandHeart,
  type LucideIcon,
} from "lucide-react";

const ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  // Saúde
  { name: "hospital", label: "Hospital", icon: Hospital },
  { name: "stethoscope", label: "Saúde", icon: Stethoscope },
  { name: "pill", label: "Farmácia", icon: Pill },
  { name: "heart-pulse", label: "Emergência", icon: HeartPulse },
  { name: "cross", label: "Cruz", icon: Cross },
  // Segurança
  { name: "shield", label: "Segurança", icon: Shield },
  { name: "siren", label: "Polícia", icon: Siren },
  { name: "badge-alert", label: "Alerta", icon: BadgeAlert },
  // Transporte
  { name: "bus", label: "Ônibus", icon: Bus },
  { name: "car", label: "Carro/Táxi", icon: Car },
  { name: "bike", label: "Bicicleta", icon: Bike },
  { name: "train", label: "Trem", icon: Train },
  { name: "plane", label: "Avião", icon: Plane },
  { name: "ship", label: "Barco", icon: Ship },
  { name: "circle-parking", label: "Estacionamento", icon: CircleParking },
  // Turismo & Cultura
  { name: "map-pin", label: "Local", icon: MapPin },
  { name: "landmark", label: "Monumento", icon: Landmark },
  { name: "church", label: "Igreja", icon: Church },
  { name: "camera", label: "Fotografia", icon: Camera },
  { name: "mountain", label: "Montanha", icon: Mountain },
  { name: "trees", label: "Natureza", icon: Trees },
  { name: "sun", label: "Clima", icon: Sun },
  { name: "umbrella", label: "Guarda-chuva", icon: Umbrella },
  { name: "eye", label: "Mirante", icon: Eye },
  { name: "music", label: "Música", icon: Music },
  { name: "palette", label: "Arte", icon: Palette },
  { name: "book-open", label: "Livro", icon: BookOpen },
  // Serviços
  { name: "globe", label: "Internet", icon: Globe },
  { name: "info", label: "Informação", icon: Info },
  { name: "phone", label: "Telefone", icon: Phone },
  { name: "briefcase", label: "Negócios", icon: Briefcase },
  { name: "building", label: "Prédio", icon: Building },
  { name: "banknote", label: "Dinheiro", icon: Banknote },
  { name: "credit-card", label: "Câmbio", icon: CreditCard },
  { name: "scale", label: "Consulado", icon: Scale },
  { name: "graduation-cap", label: "Educação", icon: GraduationCap },
  { name: "wifi", label: "Wi-Fi", icon: Wifi },
  // Comércio & Alimentação
  { name: "store", label: "Loja", icon: Store },
  { name: "shopping-bag", label: "Compras", icon: ShoppingBag },
  { name: "utensils", label: "Restaurante", icon: Utensils },
  { name: "coffee", label: "Café", icon: Coffee },
  { name: "wine", label: "Vinho", icon: Wine },
  { name: "beer", label: "Bar", icon: Beer },
  { name: "ice-cream", label: "Sorvete", icon: IceCream },
  { name: "hotel", label: "Hotel", icon: Hotel },
  // Pessoas
  { name: "users", label: "Pessoas", icon: Users },
  { name: "accessibility", label: "Acessibilidade", icon: Accessibility },
  { name: "dog", label: "Pet", icon: Dog },
  { name: "baby", label: "Infantil", icon: Baby },
  { name: "hand-heart", label: "Voluntário", icon: HandHeart },
];

// Map for rendering by name
const ICON_MAP = new Map(ICONS.map((i) => [i.name, i.icon]));

export function getIconByName(name: string | null): LucideIcon | null {
  if (!name) return null;
  return ICON_MAP.get(name) ?? null;
}

type IconPickerProps = {
  value: string;
  onChange: (name: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? ICONS.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()) || i.name.includes(search.toLowerCase()))
    : ICONS;

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">Ícone</label>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar ícone..."
        className="mt-1 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="mt-2 grid max-h-48 grid-cols-6 gap-1.5 overflow-y-auto rounded-lg border bg-gray-50 p-2">
        {filtered.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => onChange(item.name)}
            title={item.label}
            className={`flex flex-col items-center gap-0.5 rounded-lg p-2 transition-colors ${
              value === item.name
                ? "bg-primary-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[9px] leading-tight">{item.label}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-6 py-4 text-center text-xs text-gray-400">Nenhum ícone encontrado</p>
        )}
      </div>
    </div>
  );
}
