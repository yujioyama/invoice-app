"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { run, loading, error } = useAsyncAction(login);

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

  return (
    <div className="page flex items-center justify-center">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <h1 className="title mb-7 text-center">
          {t("auth.login.title")}
        </h1>
        <div className="mb-4">
          <label className="label">{t("auth.login.email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="label">{t("auth.login.password")}</label>
          <input
            type="password"
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
          disabled={loading}
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
  );
}
