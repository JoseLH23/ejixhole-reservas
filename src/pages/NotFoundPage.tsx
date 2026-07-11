import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-foreground">404</h1>
      <p className="mt-2 text-muted-foreground">{t("notFound.titulo")}</p>
      <Link to="/" className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
        {t("notFound.boton")}
      </Link>
    </div>
  );
}
