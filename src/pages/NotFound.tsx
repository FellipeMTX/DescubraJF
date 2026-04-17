import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="mt-4 text-xl text-accent-500">{t("notFound.title")}</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-primary-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}
