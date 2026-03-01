"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t("notFound.title")}</h1>
            <p className="subtitle">{t("notFound.subtitle")}</p>
          </div>
          <div className="card-body">
            <Link href="/dashboard" className="btn btn-primary">
              {t("notFound.backHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
