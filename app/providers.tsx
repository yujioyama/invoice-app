"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";
import { useSearchParams } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const langParam = searchParams.get("lang");
    if (langParam && langParam !== i18n.language) {
      i18n.changeLanguage(langParam);
      localStorage.setItem("lang", langParam);
      return;
    }

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

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
