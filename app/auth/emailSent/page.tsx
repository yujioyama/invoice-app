"use client";

import { useTranslation } from "react-i18next";

export default function EmailSentPage() {
  const { t } = useTranslation();

  return (
    <div className="page flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">
          {t("auth.emailSent.title")}
        </h1>
        <p className="mb-6 text-slate-700">{t("auth.emailSent.message")}</p>
        <p className="text-sm text-slate-500">{t("auth.emailSent.hint")}</p>
      </div>
    </div>
  );
}
