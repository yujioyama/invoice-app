"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import FormField from "@/components/ui/FormField";
import PasswordInput from "@/components/ui/PasswordInput";
import Alert from "@/components/ui/Alert";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [validationError, setValidationError] = useState("");

  const { run, loading, error } = useAsyncAction(register);

  const errorMessage = useMemo(() => {
    if (validationError) return validationError;
    if (!error) return "";
    if (error instanceof Error)
      return error.message || t("auth.register.failed");
    return t("auth.register.failed");
  }, [error, t, validationError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (password !== confirm) {
      setValidationError(t("auth.register.passwordMismatch"));
      return;
    }
    try {
      await run(email, name, password);
      router.push("/auth/emailSent");
    } catch {
      // error state is handled by useAsyncAction
    }
  };

  return (
    <div className="page flex items-center justify-center">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <h1 className="title mb-7 text-center">{t("auth.register.title")}</h1>
        <FormField
          wrapperClass="mb-4"
          label={t("auth.register.email")}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          wrapperClass="mb-4"
          label={t("auth.register.name")}
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <PasswordInput
          wrapperClass="mb-4"
          label={t("auth.register.password")}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          showLabel={t("auth.register.showPassword")}
          hideLabel={t("auth.register.hidePassword")}
        />
        <PasswordInput
          wrapperClass="mb-6"
          label={t("auth.register.confirmPassword")}
          id="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          showLabel={t("auth.register.showPassword")}
          hideLabel={t("auth.register.hidePassword")}
        />
        {errorMessage && <Alert message={errorMessage} />}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? t("auth.register.submitting") : t("auth.register.submit")}
        </button>
      </form>
    </div>
  );
}
