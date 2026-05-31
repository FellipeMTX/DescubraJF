import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BreadcrumbPill } from "@/components/programa/BreadcrumbPill";

type Props = {
  children: ReactNode;
  /** Texto do botao de breadcrumb. Default vem de `programas.common.breadcrumb`. */
  breadcrumbLabel?: string;
  /** Rota de retorno. Default `/secretaria/programas-e-projetos`. */
  breadcrumbTo?: string;
};

export function ProgramaLayout({
  children,
  breadcrumbLabel,
  breadcrumbTo = "/secretaria/programas-e-projetos",
}: Props) {
  const { t } = useTranslation();
  const label = breadcrumbLabel ?? t("programas.common.breadcrumb");
  return (
    <div className="bl-prog min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
        <BreadcrumbPill to={breadcrumbTo} label={label} />
        <div className="mt-8 flex flex-col gap-14 md:gap-16">{children}</div>
      </div>
    </div>
  );
}
