"use client";

import { useState, useEffect } from "react";
import { getMyDetails } from "@/lib/apiAuth";
import { updateMyDetails } from "@/lib/apiAuth";
import type { BankAccount } from "@/shared/types/BankAccount";
import type { User } from "@/shared/types/User";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

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

  // TODO: implement update logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMyDetails({
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

  if (loading) return <div className="container">{t("common.loading")}</div>;

  return (
    <div className="container max-w-xl py-10">
      <h1 className="text-2xl font-bold mb-6">{t("profile.editTitle")}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">{t("profile.name")}</label>
          <input className="input w-full" value={user.name || ""} readOnly />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.countryCode")}</label>
          <select
            className="input w-full"
            value={user.countryCode || ""}
            onChange={(e) => setUser({ ...user, countryCode: e.target.value })}
          >
            <option value="">{t("profile.countryCodePlaceholder")}</option>
            <option value="+81">Japan (+81)</option>
            <option value="+1">USA/Canada (+1)</option>
            <option value="+44">UK (+44)</option>
            <option value="+61">Australia (+61)</option>
            <option value="+49">Germany (+49)</option>
            <option value="+33">France (+33)</option>
            <option value="+86">China (+86)</option>
            <option value="+82">South Korea (+82)</option>
            <option value="+852">Hong Kong (+852)</option>
            <option value="+65">Singapore (+65)</option>
            <option value="+34">Spain (+34)</option>
            <option value="+39">Italy (+39)</option>
            <option value="+7">Russia (+7)</option>
            <option value="+91">India (+91)</option>
            <option value="+62">Indonesia (+62)</option>
            <option value="+60">Malaysia (+60)</option>
            <option value="+63">Philippines (+63)</option>
            <option value="+66">Thailand (+66)</option>
            <option value="+886">Taiwan (+886)</option>
            {/* 必要に応じて追加 */}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.phone")}</label>
          <input
            className="input w-full"
            value={user.phone || ""}
            placeholder={t("profile.phone")}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.street")}</label>
          <input
            className="input w-full"
            value={user.street || ""}
            placeholder={t("profile.street")}
            onChange={(e) => setUser({ ...user, street: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.city")}</label>
          <input
            className="input w-full"
            value={user.city || ""}
            placeholder={t("profile.city")}
            onChange={(e) => setUser({ ...user, city: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.state")}</label>
          <input
            className="input w-full"
            value={user.state || ""}
            placeholder={t("profile.state")}
            onChange={(e) => setUser({ ...user, state: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.country")}</label>
          <input
            className="input w-full"
            value={user.country || ""}
            placeholder={t("profile.country")}
            onChange={(e) => setUser({ ...user, country: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.postalCode")}</label>
          <input
            className="input w-full"
            value={user.postalCode || ""}
            placeholder={t("profile.postalCode")}
            onChange={(e) => setUser({ ...user, postalCode: e.target.value })}
          />
        </div>
        <hr />
        <h2 className="text-lg font-bold mb-2">{t("profile.bankAccount")}</h2>
        <div>
          <label className="block mb-1 font-medium">{t("profile.bank")}</label>
          <input
            className="input w-full"
            value={bankAccount?.bank || ""}
            placeholder={t("profile.bank")}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, bank: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.accountName")}</label>
          <input
            className="input w-full"
            value={bankAccount?.accountName || ""}
            placeholder={t("profile.accountName")}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, accountName: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.branchCode")}</label>
          <input
            className="input w-full"
            value={bankAccount?.branchCode || ""}
            placeholder={t("profile.branchCode")}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, branchCode: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.accountNumber")}</label>
          <input
            className="input w-full"
            value={bankAccount?.accountNumber || ""}
            placeholder={t("profile.accountNumber")}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, accountNumber: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.swiftBic")}</label>
          <input
            className="input w-full"
            value={bankAccount?.swiftBic || ""}
            placeholder={t("profile.swiftBic")}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, swiftBic: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.branchAddress")}</label>
          <input
            className="input w-full"
            value={bankAccount?.branchAddress || ""}
            placeholder={t("profile.branchAddress")}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, branchAddress: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.currency")}</label>
          <input
            className="input w-full"
            value={bankAccount?.currency || ""}
            placeholder={t("profile.currency")}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, currency: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("profile.intermediaryBank")}</label>
          <input
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
        </div>
        <button className="btn btn-primary w-full mt-6" type="submit">
          {t("profile.save")}
        </button>
      </form>
    </div>
  );
}
