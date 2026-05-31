import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

type Props = {
  to: string;
  label: string;
};

export function BreadcrumbPill({ to, label }: Props) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium no-underline transition-colors"
      style={{
        background: "var(--color-bl-prog-bg)",
        color: "var(--color-bl-prog-ink)",
        border: "1px solid var(--color-bl-prog-line)",
      }}
    >
      <ChevronLeft size={14} />
      {label}
    </Link>
  );
}
