const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

import type { BankAccount } from "@/shared/types/BankAccount";

export async function getMyBankAccount() {
  const res = await fetch(`${API_BASE_URL}/auth/me/bank-account`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ bankAccount: BankAccount | null }>;
}
