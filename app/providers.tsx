"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";
import { usePathname, useSearchParams } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const langParam = searchParams.get("lang");
    if (langParam && langParam !== i18n.language) {
      i18n.changeLanguage(langParam);
      localStorage.setItem("lang", langParam);
    } else {
      const saved = localStorage.getItem("lang");
      if (saved && saved !== i18n.language) {
        i18n.changeLanguage(saved);
      } else {
        const browserLang = navigator.language?.split("-")[0]; // example: 'ja'
        if (browserLang && browserLang !== i18n.language) {
          i18n.changeLanguage(browserLang);
        }
      }
    }
  }, [searchParams, pathname]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
