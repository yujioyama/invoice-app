import { useCallback, useEffect } from "react";
import { getInvoiceById, type Invoice } from "@/lib/apiInvoices";
import { getClients, type Client } from "@/lib/apiClients";
import { useAsyncLoad } from "@/hooks/useAsyncLoad";

export type InvoiceEditData = {
  invoice: Invoice;
  clients: Client[];
};

async function loadInvoiceEditData(
  invoiceId: string,
): Promise<InvoiceEditData | null> {
  const [invoice, clients] = await Promise.all([
    getInvoiceById(invoiceId),
    getClients(),
  ]);

  if (!invoice) return null;

  return { invoice, clients };
}

export function useInvoiceEditData(invoiceId: string) {
  const loader = useCallback(() => loadInvoiceEditData(invoiceId), [invoiceId]);

  const { data, loading, error, run, reset } = useAsyncLoad(loader, {
    initialData: null,
    initialLoading: true,
    onError: (err) => {
      console.error("Failed to load invoice:", err);
    },
  });

  useEffect(() => {
    run().catch(() => {
      // error is stored in hook state
    });
  }, [run]);

  return {
    data,
    loading,
    error,
    reload: run,
    reset,
  };
}
