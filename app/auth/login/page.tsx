"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/contexts/AuthContext";
import FormField from "@/components/ui/FormField";
import Alert from "@/components/ui/Alert";
import Divider from "@/components/ui/Divider";

const DEMO_EMAIL = "test.carey@example.com";
const DEMO_PASSWORD = "test";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const { run, loading, error } = useAsyncAction(login, {
    onSuccess: (data) => {
      setUser(data.user);
      router.push("/dashboard");
    },
  });

  const errorMessage = useMemo(() => {
    if (!error) return "";
    if (error instanceof Error) return error.message || t("auth.login.failed");
    return t("auth.login.failed");
  }, [error, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(email, password).catch(() => {});
  };

  const handleDemo = () => {
    run(DEMO_EMAIL, DEMO_PASSWORD).catch(() => {});
  };

  return (
    <div className="page flex items-center justify-center">
      <div className="card w-full max-w-sm p-8">
        <h1 className="title mb-7 text-center">{t("auth.login.title")}</h1>

        <button
          type="button"
          onClick={handleDemo}
          disabled={loading}
          className="btn btn-secondary w-full mb-5"
        >
          {loading ? t("landing.demo.logging") : t("auth.login.demo")}
        </button>

        <Divider label={t("auth.login.demoOr")} className="mb-5" />

        <form onSubmit={handleSubmit}>
          <FormField
            wrapperClass="mb-4"
            label={t("auth.login.email")}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <FormField
            wrapperClass="mb-6"
            label={t("auth.login.password")}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {errorMessage && <Alert message={errorMessage} />}
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
    </div>
  );
}
