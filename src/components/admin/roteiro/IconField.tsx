import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { ICONS } from "@/components/ui/IconPicker";

type Props = {
  value: string;
  onChange: (name: string) => void;
};

/** Botão compacto que expande uma grade de ícones (reusa ICONS de ui/IconPicker). */
export function IconField({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const current = ICONS.find((i) => i.name === value);

  const filtered = search
    ? ICONS.filter(
        (i) =>
          i.label.toLowerCase().includes(search.toLowerCase()) ||
          i.name.includes(search.toLowerCase()),
      )
    : ICONS;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Escolher ícone"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-foreground hover:bg-muted"
      >
        {current ? <current.icon size={18} /> : <ImageIcon size={16} className="text-muted-foreground" />}
      </button>

      {open && (
        <div className="mt-2 rounded-lg border bg-muted p-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ícone..."
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
          />
          <div className="mt-2 grid max-h-40 grid-cols-6 gap-1 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.name}
                type="button"
                title={item.label}
                onClick={() => {
                  onChange(item.name);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                  value === item.name
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-background"
                }`}
              >
                <item.icon size={18} />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-6 py-3 text-center text-xs text-muted-foreground">
                Nenhum ícone
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
