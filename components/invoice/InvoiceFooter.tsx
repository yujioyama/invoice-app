"use client";

import { useTranslation } from "react-i18next";
import { User } from "@/shared/types/User";

interface InvoiceFooterProps {
  user: User | null;
}

export default function InvoiceFooter({ user }: InvoiceFooterProps) {
  const { i18n } = useTranslation();
  const isJa = i18n.language?.startsWith("ja");

  const phoneDisplay = [user?.countryCode, user?.phone]
    .filter(Boolean)
    .join(" ");

  // Japanese: 〒postalCode country / state + city + street
  // English:  street, city, state / postalCode, country
  const line1 = isJa
    ? [`〒${user?.postalCode ?? ""}`, user?.country].filter(Boolean).join(" ")
    : [user?.street, user?.city, user?.state].filter(Boolean).join(", ");

  const line2 = isJa
    ? [user?.state, user?.city, user?.street].filter(Boolean).join("")
    : [user?.postalCode, user?.country].filter(Boolean).join(", ");

  return (
    <div className="invoice-footer flex justify-between px-20 pt-6 pb-6 bg-[#f6f5f4]">
      <div className="font-now">
        {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
      </div>
      <div className="text-right font-tt-chocolates">
        <p>{phoneDisplay}</p>
        <p>{user?.email}</p>
        <p>{line1}</p>
        <p>{line2}</p>
      </div>
    </div>
  );
}
