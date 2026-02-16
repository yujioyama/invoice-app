import { useCallback, useEffect } from "react";
import { getInvoiceById, type Invoice } from "@/lib/apiInvoices";
import { getClientById, type Client } from "@/lib/apiClients";
import { getMyDetails } from "@/lib/apiAuth";
import type { BankAccount } from "@/shared/types/BankAccount";
import type { User } from "@/shared/types/User";
import { useAsyncLoad } from "@/hooks/useAsyncLoad";

export type InvoiceDetailData = {
  invoice: Invoice;
  client: Client | null;
  user: User | null;
  bankAccount: BankAccount | null;
};

type MyDetailsResponse = {
  user?: User | null;
} | null;

async function loadInvoiceDetail(
  invoiceId: string,
): Promise<InvoiceDetailData | null> {
  const [invoice, myDetails] = await Promise.all([
    getInvoiceById(invoiceId),
    getMyDetails() as Promise<MyDetailsResponse>,
  ]);

  if (!invoice) return null;

  const user = myDetails?.user ?? null;
  const bankAccount = user?.bankAccounts?.[0] ?? null;

  const client = invoice.clientId
    ? await getClientById(invoice.clientId)
    : null;

  return {
    invoice,
    client,
    user,
    bankAccount,
  };
}

export function useInvoiceDetail(invoiceId: string) {
  const loader = useCallback(() => loadInvoiceDetail(invoiceId), [invoiceId]);

  const { data, loading, error, run, reset } = useAsyncLoad(loader, {
    initialData: null,
    initialLoading: true,
    onError: (err) => {
      console.error("Failed to load invoice:", err);
    },
  });

  useEffect(() => {
    run().catch(() => {
      // error is stored in hook state; page can render fallback
    });
  }, [run]);

  return {
    invoice: data?.invoice ?? null,
    client: data?.client ?? null,
    user: data?.user ?? null,
    bankAccount: data?.bankAccount ?? null,
    loading,
    error,
    reload: run,
    reset,
  };
}
