"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        <div className="mb-4">
          <label className="label" htmlFor="email">
            {t("auth.register.email")}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="mb-4">
          <label className="label" htmlFor="name">
            {t("auth.register.name")}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="mb-4">
          <label className="label" htmlFor="password">
            {t("auth.register.password")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword
                  ? t("auth.register.hidePassword")
                  : t("auth.register.showPassword")
              }
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.122 2.122A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.234-.336 4.675-.938m2.122-2.122A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.234.336-4.675.938"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.336 1.657-.336 3.234 0 4.675m-2.122-2.122A7.963 7.963 0 0120 15c0 4.418-3.582 8-8 8-1.657 0-3.234-.336-4.675-.938m-2.122-2.122A7.963 7.963 0 014 9c0-4.418 3.582-8 8-8 1.657 0 3.234.336 4.675.938"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="label" htmlFor="confirm">
            {t("auth.register.confirmPassword")}
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input pr-10"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm
                  ? t("auth.register.hidePassword")
                  : t("auth.register.showPassword")
              }
            >
              {showConfirm ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.122 2.122A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.234-.336 4.675-.938m2.122-2.122A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.234.336-4.675.938"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.336 1.657-.336 3.234 0 4.675m-2.122-2.122A7.963 7.963 0 0120 15c0 4.418-3.582 8-8 8-1.657 0-3.234-.336-4.675-.938m-2.122-2.122A7.963 7.963 0 014 9c0-4.418 3.582-8 8-8 1.657 0 3.234.336 4.675.938"
                  />
                </svg>
              )}
            </button>
          </div>
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
          {loading ? t("auth.register.submitting") : t("auth.register.submit")}
        </button>
      </form>
    </div>
  );
}
