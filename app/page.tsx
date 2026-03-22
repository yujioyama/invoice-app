"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, login } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const DEMO_EMAIL = "test.carey@example.com";
const DEMO_PASSWORD = "test";

const STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "NestJS",
  "Prisma",
  "PostgreSQL",
];

export default function LandingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user.id) {
      router.replace("/dashboard");
    } else {
      setReady(true);
    }
  }, [router, user]);

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD);
      router.push("/dashboard");
    } catch {
      setDemoLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-4 pb-20 pt-24 text-center sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <span className="mb-5 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            {t("landing.badge")}
          </span>

          <h1 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t("landing.hero.title")}
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-slate-500">
            {t("landing.hero.subtitle")}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="btn btn-primary w-full px-8 py-2.5 text-base sm:w-auto"
            >
              {demoLoading
                ? t("landing.demo.logging")
                : t("landing.hero.tryDemo")}
            </button>
            <a
              href="/auth/login"
              className="btn btn-secondary w-full px-8 py-2.5 text-base sm:w-auto"
            >
              {t("landing.hero.login")}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-slate-900">
            {t("landing.features.title")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                key: "invoice",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
                color: "text-indigo-600 bg-indigo-50",
              },
              {
                key: "clients",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                color: "text-violet-600 bg-violet-50",
              },
              {
                key: "pdf",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                ),
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                key: "i18n",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                ),
                color: "text-amber-600 bg-amber-50",
              },
            ].map(({ key, icon, color }) => (
              <div
                key={key}
                className="flex gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
                >
                  {icon}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">
                    {t(`landing.features.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {t(`landing.features.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-16 text-center">
        <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-slate-400">
          {t("landing.stack.title")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
