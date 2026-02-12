"use client";

import { User } from "@/shared/types/User";
import { useTranslation } from "react-i18next";
interface SignatureSectionProps {
  createdAt: string;
  firstName: User["firstName"];
  lastName: User["lastName"];
}

export default function SignatureSection({
  createdAt,
  firstName,
  lastName,
}: SignatureSectionProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ja") ? "ja-JP" : "en-GB";

  const formattedDate = (() => {
    const base = new Date(createdAt).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return locale.startsWith("en")
      ? base.replace(/(\w+)\s(\d+)/, "$1, $2")
      : base;
  })();

  return (
    <div>
      <h3 className="mb-3 text-lg tracking-wide font-now">
        {t("invoicePdf.authorizedSignature")}
      </h3>
      <div className="mb-5 text-[26px] font-eyesome-script">
        {firstName} {lastName}
      </div>
      <p className="text-sm font-tt-chocolates">
        {t("invoicePdf.date")}: {formattedDate}
      </p>
    </div>
  );
}
