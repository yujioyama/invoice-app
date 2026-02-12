"use client";

import { BankAccount } from "@/shared/types/BankAccount";
import { useTranslation } from "react-i18next";

type PaymentInformationProps = {
  bankAccount: BankAccount;
};

export default function PaymentInformation({
  bankAccount,
}: PaymentInformationProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-base tracking-wide font-now">
        {t("invoicePdf.paymentInformation")}:
      </h3>
      <div className="text-sm font-tt-chocolates space-y-0.5">
        <div className="grid grid-cols-[140px_1fr]">
          <span>{t("profile.bank")}:</span>
          <span>{bankAccount.bank}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>{t("profile.accountName")}:</span>
          <span>{bankAccount.accountName}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>{t("profile.branchCode")}:</span>
          <span>{bankAccount.branchCode}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>{t("profile.accountNumber")}:</span>
          <span>{bankAccount.accountNumber}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>{t("profile.swiftBic")}:</span>
          <span>{bankAccount.swiftBic}</span>
        </div>
        {bankAccount.branchAddress && (
          <div className="grid grid-cols-[140px_1fr]">
            <span>{t("profile.branchAddress")}:</span>
            <span>{bankAccount.branchAddress}</span>
          </div>
        )}
        <div className="grid grid-cols-[140px_1fr]">
          <span>{t("profile.currency")}:</span>
          <span>{bankAccount.currency}</span>
        </div>
        {bankAccount.intermediaryBank && (
          <div className="grid grid-cols-[140px_1fr]">
            <span>{t("profile.intermediaryBank")}:</span>
            <span>{bankAccount.intermediaryBank}</span>
          </div>
        )}
      </div>
    </div>
  );
}
