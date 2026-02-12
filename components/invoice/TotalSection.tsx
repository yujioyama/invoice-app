"use client";

import { useTranslation } from "react-i18next";

interface TotalSectionProps {
  total: number;
}

export default function TotalSection({ total }: TotalSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <p className="text-base font-bold font-now text-black">
        {t("invoicePdf.totalDueAud")}{" "}
        <span className="float-right">${total.toFixed(2)}</span>
      </p>
    </div>
  );
}
