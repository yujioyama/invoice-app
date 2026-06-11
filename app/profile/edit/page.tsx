"use client";

import { useState, useEffect } from "react";
import { getMyDetails } from "@/lib/apiAuth";
import { updateMyDetails } from "@/lib/apiAuth";
import type { BankAccount } from "@/shared/types/BankAccount";
import type { User } from "@/shared/types/User";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import FormField from "@/components/ui/FormField";
import LoadingPage from "@/components/ui/LoadingPage";
import Divider from "@/components/ui/Divider";

const emptyBankAccount: BankAccount = {
  id: "",
  userId: "",
  accountName: "",
  branchCode: "",
  accountNumber: "",
  swiftBic: "",
  bank: "",
  branchAddress: "",
  currency: "",
  intermediaryBank: "",
  createdAt: "",
  updatedAt: "",
};

export default function ProfileEditPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<Partial<User>>({});
  const [bankAccount, setBankAccount] = useState<
    BankAccount | typeof emptyBankAccount
  >(emptyBankAccount);
  const [loading, setLoading] = useState(true);

  const { run: saveProfile, loading: saving } = useAsyncAction(updateMyDetails);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const userRes = await getMyDetails();
      setUser(userRes?.user || {});

      const firstBankAccount = userRes?.user.bankAccounts?.[0];
      setBankAccount(firstBankAccount ? firstBankAccount : emptyBankAccount);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        countryCode: user.countryCode,
        street: user.street,
        city: user.city,
        state: user.state,
        country: user.country,
        postalCode: user.postalCode,
        bankAccount: {
          id: bankAccount?.id || undefined,
          bank: bankAccount?.bank,
          accountName: bankAccount?.accountName,
          branchCode: bankAccount?.branchCode,
          accountNumber: bankAccount?.accountNumber,
          swiftBic: bankAccount?.swiftBic,
          branchAddress: bankAccount?.branchAddress,
          currency: bankAccount?.currency,
          intermediaryBank: bankAccount?.intermediaryBank,
        },
      });
      toast.success(t("profile.updated"));
    } catch {
      toast.error(t("profile.updateFailed"));
    }
  };

  if (loading) return <LoadingPage message={t("common.loading")} />;

  return (
    <div className="page">
      <div className="container max-w-xl">
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t("profile.editTitle")}</h1>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">{t("profile.name")}</label>
                <input className="input w-full" value={user.name || ""} readOnly />
              </div>
              <FormField
                label={t("profile.firstName")}
                className="input w-full"
                value={user.firstName || ""}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              />
              <FormField
                label={t("profile.lastName")}
                className="input w-full"
                value={user.lastName || ""}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
              <div>
                <label className="label">{t("profile.countryCode")}</label>
                <select
                  className="input w-full"
                  value={user.countryCode || ""}
                  onChange={(e) =>
                    setUser({ ...user, countryCode: e.target.value })
                  }
                >
                  <option value="">{t("profile.countryCodePlaceholder")}</option>
                  <option value="+81">{t("profile.countryCodeOptions.japan")}</option>
                  <option value="+1">{t("profile.countryCodeOptions.usaCanada")}</option>
                  <option value="+44">{t("profile.countryCodeOptions.uk")}</option>
                  <option value="+61">{t("profile.countryCodeOptions.australia")}</option>
                  <option value="+49">{t("profile.countryCodeOptions.germany")}</option>
                  <option value="+33">{t("profile.countryCodeOptions.france")}</option>
                  <option value="+86">{t("profile.countryCodeOptions.china")}</option>
                  <option value="+82">{t("profile.countryCodeOptions.southKorea")}</option>
                  <option value="+852">{t("profile.countryCodeOptions.hongKong")}</option>
                  <option value="+65">{t("profile.countryCodeOptions.singapore")}</option>
                  <option value="+34">{t("profile.countryCodeOptions.spain")}</option>
                  <option value="+39">{t("profile.countryCodeOptions.italy")}</option>
                  <option value="+7">{t("profile.countryCodeOptions.russia")}</option>
                  <option value="+91">{t("profile.countryCodeOptions.india")}</option>
                  <option value="+62">{t("profile.countryCodeOptions.indonesia")}</option>
                  <option value="+60">{t("profile.countryCodeOptions.malaysia")}</option>
                  <option value="+63">{t("profile.countryCodeOptions.philippines")}</option>
                  <option value="+66">{t("profile.countryCodeOptions.thailand")}</option>
                  <option value="+886">{t("profile.countryCodeOptions.taiwan")}</option>
                </select>
              </div>
              <FormField
                label={t("profile.phone")}
                className="input w-full"
                value={user.phone || ""}
                placeholder={t("profile.phone")}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
              <FormField
                label={t("profile.street")}
                className="input w-full"
                value={user.street || ""}
                placeholder={t("profile.street")}
                onChange={(e) => setUser({ ...user, street: e.target.value })}
              />
              <FormField
                label={t("profile.city")}
                className="input w-full"
                value={user.city || ""}
                placeholder={t("profile.city")}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
              />
              <FormField
                label={t("profile.state")}
                className="input w-full"
                value={user.state || ""}
                placeholder={t("profile.state")}
                onChange={(e) => setUser({ ...user, state: e.target.value })}
              />
              <FormField
                label={t("profile.country")}
                className="input w-full"
                value={user.country || ""}
                placeholder={t("profile.country")}
                onChange={(e) => setUser({ ...user, country: e.target.value })}
              />
              <FormField
                label={t("profile.postalCode")}
                className="input w-full"
                value={user.postalCode || ""}
                placeholder={t("profile.postalCode")}
                onChange={(e) =>
                  setUser({ ...user, postalCode: e.target.value })
                }
              />
              <div className="pt-2">
                <Divider
                  label={t("profile.bankAccount")}
                  className="[&>span]:font-semibold [&>span]:uppercase [&>span]:tracking-wider"
                />
              </div>
              <FormField
                label={t("profile.bank")}
                className="input w-full"
                value={bankAccount?.bank || ""}
                placeholder={t("profile.bank")}
                onChange={(e) =>
                  setBankAccount({ ...bankAccount, bank: e.target.value })
                }
              />
              <FormField
                label={t("profile.accountName")}
                className="input w-full"
                value={bankAccount?.accountName || ""}
                placeholder={t("profile.accountName")}
                onChange={(e) =>
                  setBankAccount({ ...bankAccount, accountName: e.target.value })
                }
              />
              <FormField
                label={t("profile.branchCode")}
                className="input w-full"
                value={bankAccount?.branchCode || ""}
                placeholder={t("profile.branchCode")}
                onChange={(e) =>
                  setBankAccount({ ...bankAccount, branchCode: e.target.value })
                }
              />
              <FormField
                label={t("profile.accountNumber")}
                className="input w-full"
                value={bankAccount?.accountNumber || ""}
                placeholder={t("profile.accountNumber")}
                onChange={(e) =>
                  setBankAccount({
                    ...bankAccount,
                    accountNumber: e.target.value,
                  })
                }
              />
              <FormField
                label={t("profile.swiftBic")}
                className="input w-full"
                value={bankAccount?.swiftBic || ""}
                placeholder={t("profile.swiftBic")}
                onChange={(e) =>
                  setBankAccount({ ...bankAccount, swiftBic: e.target.value })
                }
              />
              <FormField
                label={t("profile.branchAddress")}
                className="input w-full"
                value={bankAccount?.branchAddress || ""}
                placeholder={t("profile.branchAddress")}
                onChange={(e) =>
                  setBankAccount({
                    ...bankAccount,
                    branchAddress: e.target.value,
                  })
                }
              />
              <FormField
                label={t("profile.currency")}
                className="input w-full"
                value={bankAccount?.currency || ""}
                placeholder={t("profile.currency")}
                onChange={(e) =>
                  setBankAccount({ ...bankAccount, currency: e.target.value })
                }
              />
              <FormField
                label={t("profile.intermediaryBank")}
                className="input w-full"
                value={bankAccount?.intermediaryBank || ""}
                placeholder={t("profile.intermediaryBank")}
                onChange={(e) =>
                  setBankAccount({
                    ...bankAccount,
                    intermediaryBank: e.target.value,
                  })
                }
              />
              <button
                className="btn btn-primary w-full mt-6"
                type="submit"
                disabled={saving}
              >
                {t("profile.save")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
