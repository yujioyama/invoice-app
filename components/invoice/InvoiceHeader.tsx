"use client";

import { useTranslation } from "react-i18next";

export default function InvoiceHeader() {
  const { t } = useTranslation();

  return (
    <h1 className="pt-11 pb-9 px-20 text-3xl font-bold tracking-widest bg-[#f6f5f4] font-tt-drugs">
      {t("invoicePdf.invoice")}
    </h1>
  );
}
