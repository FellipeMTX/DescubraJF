import type { ReactNode } from "react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SectionBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
