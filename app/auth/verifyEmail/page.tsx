"use client";

import { useEffect } from "react";
import { verifyEmail } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";

export default function EmailVerifiedPage() {
  const { t } = useTranslation();

  useEffect(() => {
    async function verify() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (!token) {
        alert(t("auth.verifyEmail.invalidLink"));
        return;
      }

      try {
        await verifyEmail(token);
      } catch (error) {
        console.error("Email verification failed:", error);
        alert(t("auth.verifyEmail.failed"));
      }
    }
    verify();
  }, [t]);

  return (
    <div className="page flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          {t("auth.verifyEmail.title")}
        </h1>
        <p className="mb-6 text-slate-700">{t("auth.verifyEmail.message")}</p>
        <a href="/auth/login" className="btn btn-primary w-full">
          {t("auth.verifyEmail.goToLogin")}
        </a>
      </div>
    </div>
  );
}
