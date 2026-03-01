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
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/clients"
                className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white/60 p-5 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/40 hover:shadow-md hover:shadow-indigo-100/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900">
                    {t("dashboard.clients")}
                  </div>
                  <div className="mt-0.5 text-sm text-slate-500">
                    {t("dashboard.clientsDesc")}
                  </div>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/invoices"
                className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white/60 p-5 transition-all duration-200 hover:border-violet-100 hover:bg-violet-50/40 hover:shadow-md hover:shadow-violet-100/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900">
                    {t("dashboard.invoices")}
                  </div>
                  <div className="mt-0.5 text-sm text-slate-500">
                    {t("dashboard.invoicesDesc")}
                  </div>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-violet-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
