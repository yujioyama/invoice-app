"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <main className="page">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t("dashboard.title")}</h1>
            <p className="subtitle">{t("dashboard.subtitle")}</p>
          </div>

          <div className="card-body">
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/clients"
                className="card block p-5 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {t("dashboard.clients")}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {t("dashboard.clientsDesc")}
                    </div>
                  </div>
                  <div className="text-2xl">👥</div>
                </div>
              </Link>

              <Link
                href="/invoices"
                className="card block p-5 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {t("dashboard.invoices")}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {t("dashboard.invoicesDesc")}
                    </div>
                  </div>
                  <div className="text-2xl">🧾</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
