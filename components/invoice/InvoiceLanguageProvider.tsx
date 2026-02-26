"use client";

import { useMemo } from "react";
import i18next from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

import enCommon from "@/app/i18n/locales/en/common.json";
import jaCommon from "@/app/i18n/locales/ja/common.json";
import type { InvoiceLanguage } from "@/shared/types/Invoice";

const resources = {
  en: { common: enCommon },
  ja: { common: jaCommon },
} as const;

export function InvoiceLanguageProvider({
  language,
  children,
}: {
  language: InvoiceLanguage;
  children: React.ReactNode;
}) {
  const invoiceI18n = useMemo(() => {
    const instance = i18next.createInstance();
    instance.use(initReactI18next).init({
      resources,
      lng: language,
      fallbackLng: "en",
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
      },
    });
    return instance;
  }, [language]);

  return <I18nextProvider i18n={invoiceI18n}>{children}</I18nextProvider>;
}
