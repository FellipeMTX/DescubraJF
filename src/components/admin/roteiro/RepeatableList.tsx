import type { ReactNode } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  /** Cria um novo item vazio ao adicionar. */
  newItem: () => T;
  addLabel: string;
  max?: number;
  /** Chave estável por item (recomendado quando os itens têm estado interno, ex.: upload de imagem). */
  getKey?: (item: T, index: number) => string | number;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
};

/** Editor genérico de lista (adicionar / remover / reordenar). */
export function RepeatableList<T>({ items, onChange, newItem, addLabel, max, getKey, renderItem }: Props<T>) {
  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const add = () => {
    if (max && items.length >= max) return;
    onChange([...items, newItem()]);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={getKey ? getKey(item, i) : i} className="rounded-lg border bg-muted/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(i, -1)} disabled={i === 0}>
                <ChevronUp size={14} />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                <ChevronDown size={14} />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(i)}>
                <Trash2 size={14} className="text-red-500" />
              </Button>
            </div>
          </div>
          {renderItem(item, (patch) => update(i, patch), i)}
        </div>
      ))}
      {(!max || items.length < max) && (
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus size={14} className="mr-1.5" /> {addLabel}
        </Button>
      )}
    </div>
  );
}
