"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";
import { useSearchParams } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");

  useEffect(() => {
    const applyDocumentLang = (lng: string) => {
      const normalized = (lng || "en").split("-")[0];
      document.documentElement.lang = normalized === "ja" ? "ja" : "en";
    };

    applyDocumentLang(i18n.language);
    i18n.on("languageChanged", applyDocumentLang);

    return () => {
      i18n.off("languageChanged", applyDocumentLang);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
      return;
    }

    const browserLang = navigator.language?.split("-")[0];
    if (browserLang && browserLang !== i18n.language) {
      i18n.changeLanguage(browserLang);
    }
  }, []);

  useEffect(() => {
    if (!langParam) return;

    const normalizedLang = langParam.split("-")[0];
    if (normalizedLang && normalizedLang !== i18n.language) {
      i18n.changeLanguage(normalizedLang);
      localStorage.setItem("lang", normalizedLang);
    }
  }, [langParam]);

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </AuthProvider>
  );
}
