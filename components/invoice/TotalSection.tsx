"use client";

import { useTranslation } from "react-i18next";
import type { Currency } from "@/shared/types/Invoice";
import { formatCurrency } from "@/lib/formatCurrency";

interface TotalSectionProps {
  total: number;
  currency: Currency;
}

export default function TotalSection({ total, currency }: TotalSectionProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ja") ? "ja-JP" : "en-GB";

  return (
    <div className="mb-8">
      <p className="text-base font-bold font-now text-black">
        {t("invoicePdf.totalDue", { currency })}{" "}
        <span className="float-right">{formatCurrency(total, currency, locale)}</span>
      </p>
    </div>
  );
}
