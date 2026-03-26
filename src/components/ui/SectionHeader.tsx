import type { ReactNode } from "react";

type SectionHeaderProps = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  dark?: boolean;
};

export function SectionHeader({ icon, title, subtitle, dark }: SectionHeaderProps) {
  return (
    <div className="mb-8 text-center">
      {icon && (
        <div className={`mb-3 inline-flex rounded-full p-3 ${dark ? "bg-primary-400/15" : "bg-primary-100"}`}>
          {icon}
        </div>
      )}
      <h2
        className={`text-3xl font-bold ${dark ? "text-accent-50" : "text-primary-800"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-lg ${dark ? "text-primary-200" : "text-accent-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
