"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";
import { useAsyncAction } from "@/hooks/useAsyncAction";

const DEMO_EMAIL = "test.carey@example.com";
const DEMO_PASSWORD = "test";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { run, loading, error } = useAsyncAction(login);
  const { run: runDemo, loading: demoLoading } = useAsyncAction(login);

  const errorMessage = useMemo(() => {
    if (!error) return "";
    if (error instanceof Error) return error.message || t("auth.login.failed");
    return t("auth.login.failed");
  }, [error, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await run(email, password);
      router.push("/dashboard");
    } catch {
      // error state is handled by useAsyncAction
    }
  };

  const handleDemo = async () => {
    try {
      await runDemo(DEMO_EMAIL, DEMO_PASSWORD);
      router.push("/dashboard");
    } catch {
      // error state is handled by useAsyncAction
    }
  };

  return (
    <div className="page flex items-center justify-center">
      <div className="card w-full max-w-sm p-8">
        <h1 className="title mb-7 text-center">{t("auth.login.title")}</h1>

        {/* デモボタン */}
        <button
          type="button"
          onClick={handleDemo}
          disabled={demoLoading || loading}
          className="btn btn-secondary w-full mb-5"
        >
          {demoLoading ? t("landing.demo.logging") : t("auth.login.demo")}
        </button>

        <div className="relative mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">
            {t("auth.login.demoOr")}
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label" htmlFor="email">
              {t("auth.login.email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <label className="label" htmlFor="password">
              {t("auth.login.password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              autoComplete="current-password"
            />
          </div>
          {errorMessage && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading || demoLoading}
          >
            {loading ? t("auth.login.submitting") : t("auth.login.submit")}
          </button>
          <a
            href="/auth/register"
            className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {t("auth.login.registerLink")}
          </a>
        </form>
      </div>
    </div>
  );
}
