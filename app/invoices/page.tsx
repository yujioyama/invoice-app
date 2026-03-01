"use client";

import { useRouter } from "next/navigation";
import { getInvoices } from "@/lib/apiInvoices";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { deleteInvoice } from "@/lib/apiInvoices";
import { useTranslation } from "react-i18next";
import { useAsyncLoad } from "@/hooks/useAsyncLoad";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export default function InvoicesListPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    data: invoices,
    setData: setInvoices,
    loading,
    run: loadInvoices,
  } = useAsyncLoad(getInvoices, {
    initialData: null,
    initialLoading: true,
    onError: () => toast.error(t("invoices.loadFailed")),
  });

  const { run: runDeleteInvoice } = useAsyncAction(deleteInvoice);

  const isJapanese = i18n.language?.startsWith("ja");
  const dateLocale = isJapanese ? "ja-JP" : "en-GB";
  const dateOptions: Intl.DateTimeFormatOptions = isJapanese
    ? { year: "numeric", month: "2-digit", day: "2-digit" }
    : { day: "numeric", month: "short", year: "numeric" };

  const handleDetail = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  const handleNewInvoice = () => {
    router.push("/invoices/new");
  };

  const handleDeleteInvoice = async (id: string) => {
    const invoiceName =
      invoices?.find((invoice) => invoice.id === id)?.name || "";
    setDeletingId(id);
    try {
      await runDeleteInvoice(id);
      setInvoices(
        (prevInvoices) =>
          prevInvoices?.filter((invoice) => invoice.id !== id) || null,
      );
      toast.success(
        t("invoices.deleted", {
          name: invoiceName ? ` "${invoiceName}"` : "",
        }),
      );
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error(t("invoices.deleteFailed"));
    } finally {
      setDeletingId((prev) => (prev === id ? null : prev));
    }
  };

  useEffect(() => {
    loadInvoices().catch((error) => {
      console.error("Failed to load invoices:", error);
    });
  }, [loadInvoices]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p className="text-slate-700">{t("invoices.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="card-header flex items-center justify-between gap-4">
            <div>
              <h1 className="title">{t("invoices.title")}</h1>
              <p className="subtitle">{t("invoices.subtitle")}</p>
            </div>
            <button onClick={handleNewInvoice} className="btn btn-primary">
              {t("invoices.new")}
            </button>
          </div>

          <div className="card-body">
            {invoices && invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t("invoices.client")}</th>
                      <th>{t("invoices.invoice")}</th>
                      <th className="text-center">{t("invoices.tasks")}</th>
                      <th className="text-center">{t("invoices.created")}</th>
                      <th className="text-center">{t("invoices.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="text-slate-500">{invoice.client?.name || t("invoices.none")}</td>
                        <td className="font-medium text-slate-900">{invoice.name}</td>
                        <td className="text-center">
                          {invoice.tasks?.length || 0}
                        </td>
                        <td className="text-center">
                          {invoice.createdAt &&
                            new Date(invoice.createdAt).toLocaleDateString(
                              dateLocale,
                              dateOptions,
                            )}
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDetail(invoice.id)}
                              className="btn btn-ghost"
                            >
                              {t("invoices.view")}
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="btn btn-danger ml-2"
                              disabled={deletingId === invoice.id}
                            >
                              {t("invoices.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-700 mb-4">{t("invoices.empty")}</p>
                <button onClick={handleNewInvoice} className="btn btn-primary">
                  {t("invoices.create")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
