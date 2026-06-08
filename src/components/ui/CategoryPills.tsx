import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PillCategory = { id: string; nome: string; cor: string | null };

/** Renders one colored Badge per category. */
export function CategoryPills({
  categorias,
  className,
  badgeClassName,
}: {
  categorias: PillCategory[];
  className?: string;
  badgeClassName?: string;
}) {
  if (categorias.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {categorias.map((cat) => (
        <Badge
          key={cat.id}
          className={cn("text-white", badgeClassName)}
          style={{ backgroundColor: cat.cor ?? "var(--color-primary-400)" }}
        >
          {cat.nome}
        </Badge>
      ))}
    </div>
  );
}
