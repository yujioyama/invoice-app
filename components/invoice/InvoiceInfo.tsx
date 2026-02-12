"use client";

import { Client } from "@/shared/types/Client";
import { useTranslation } from "react-i18next";

interface InvoiceInfoProps {
  invoiceName: string;
  createdAt: string;
  client: Client | null;
}

export default function InvoiceInfo({
  invoiceName,
  createdAt,
  client,
}: InvoiceInfoProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ja") ? "ja-JP" : "en-GB";

  const formattedDate = createdAt
    ? (() => {
        const base = new Date(createdAt).toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        return locale.startsWith("en")
          ? base.replace(/(\w+)\s(\d+)/, "$1, $2")
          : base;
      })()
    : "";

  return (
    <div className="flex justify-between mb-8">
      <div>
        <h2 className="mb-3 text-lg tracking-wide font-now">
          {t("invoicePdf.billedTo")}:
        </h2>
        <p className="text-sm tracking-wider font-tt-chocolates">
          {client ? (
            <>
              {client.name}
              <br />
              {client.address}
              <br />
              {client.country}
            </>
          ) : (
            t("invoices.none")
          )}
        </p>
      </div>
      <div className="text-right">
        <p className="mb-4 text-lg tracking-wide font-now">
          {t("invoicePdf.invoice")}: {invoiceName}
        </p>
        <p className="text-sm tracking-wider font-tt-chocolates">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
