"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t("auth.login.failed"));
      } else {
        setError(t("auth.login.failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex items-center justify-center">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">
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
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? t("auth.login.submitting") : t("auth.login.submit")}
        </button>
        <a
          href="/auth/register"
          className="mt-4 block text-center text-blue-600 hover:underline"
        >
          {t("auth.login.registerLink")}
        </a>
      </form>
    </div>
  );
}
