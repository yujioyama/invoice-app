"use client";

import { useState, useEffect } from "react";
import { getMyDetails } from "@/lib/apiAuth";
import { updateMyDetails } from "@/lib/apiAuth";
import type { BankAccount } from "@/shared/types/BankAccount";
import type { User } from "@/shared/types/User";
import toast from "react-hot-toast";

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
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container max-w-xl py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input className="input w-full" value={user.name || ""} readOnly />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            className="input w-full"
            value={user.phone || ""}
            placeholder="Phone"
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Country Code</label>
          <input
            className="input w-full"
            value={user.countryCode || ""}
            placeholder="+81"
            onChange={(e) => setUser({ ...user, countryCode: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Street</label>
          <input
            className="input w-full"
            value={user.street || ""}
            placeholder="Street"
            onChange={(e) => setUser({ ...user, street: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            className="input w-full"
            value={user.city || ""}
            placeholder="City"
            onChange={(e) => setUser({ ...user, city: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">State</label>
          <input
            className="input w-full"
            value={user.state || ""}
            placeholder="State"
            onChange={(e) => setUser({ ...user, state: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Country</label>
          <input
            className="input w-full"
            value={user.country || ""}
            placeholder="Country"
            onChange={(e) => setUser({ ...user, country: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Postal Code</label>
          <input
            className="input w-full"
            value={user.postalCode || ""}
            placeholder="Postal Code"
            onChange={(e) => setUser({ ...user, postalCode: e.target.value })}
          />
        </div>
        <hr />
        <h2 className="text-lg font-bold mb-2">Bank Account</h2>
        <div>
          <label className="block mb-1 font-medium">Bank</label>
          <input
            className="input w-full"
            value={bankAccount?.bank || ""}
            placeholder="Bank"
            onChange={(e) =>
              setBankAccount({ ...bankAccount, bank: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Account Name</label>
          <input
            className="input w-full"
            value={bankAccount?.accountName || ""}
            placeholder="Account Name"
            onChange={(e) =>
              setBankAccount({ ...bankAccount, accountName: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Branch Code</label>
          <input
            className="input w-full"
            value={bankAccount?.branchCode || ""}
            placeholder="Branch Code"
            onChange={(e) =>
              setBankAccount({ ...bankAccount, branchCode: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Account Number</label>
          <input
            className="input w-full"
            value={bankAccount?.accountNumber || ""}
            placeholder="Account Number"
            onChange={(e) =>
              setBankAccount({ ...bankAccount, accountNumber: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">SWIFT/BIC</label>
          <input
            className="input w-full"
            value={bankAccount?.swiftBic || ""}
            placeholder="SWIFT/BIC"
            onChange={(e) =>
              setBankAccount({ ...bankAccount, swiftBic: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Branch Address</label>
          <input
            className="input w-full"
            value={bankAccount?.branchAddress || ""}
            placeholder="Branch Address"
            onChange={(e) =>
              setBankAccount({ ...bankAccount, branchAddress: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Currency</label>
          <input
            className="input w-full"
            value={bankAccount?.currency || ""}
            placeholder="Currency"
            onChange={(e) =>
              setBankAccount({ ...bankAccount, currency: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Intermediary Bank</label>
          <input
            className="input w-full"
            value={bankAccount?.intermediaryBank || ""}
            placeholder="Intermediary Bank"
            onChange={(e) =>
              setBankAccount({
                ...bankAccount,
                intermediaryBank: e.target.value,
              })
            }
          />
        </div>
        <button className="btn btn-primary w-full mt-6" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}
