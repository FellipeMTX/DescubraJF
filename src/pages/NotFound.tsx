import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="bl-app flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="bl-display"
        style={{
          fontSize: "clamp(96px, 14vw, 180px)",
          color: "var(--color-bl-accent)",
        }}
      >
        404
      </div>
      <p
        className="mt-2 text-xl"
        style={{ color: "var(--color-bl-muted)" }}
      >
        {t("notFound.title")}
      </p>
      <Link to="/" className="bl-btn mt-8">
        {t("notFound.back")}
      </Link>
    </div>
  );
}
