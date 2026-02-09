"use client";

import { useRouter } from "next/navigation";
import { getInvoices, Invoice } from "@/lib/apiInvoices";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { deleteInvoice } from "@/lib/apiInvoices";
import { useTranslation } from "react-i18next";

export default function InvoicesListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  const handleDetail = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  const handleNewInvoice = () => {
    router.push("/invoices/new");
  };

  const handleDeleteInvoice = async (id: string) => {
    const invoiceName =
      invoices?.find((invoice) => invoice.id === id)?.name || "";
    try {
      await deleteInvoice(id);
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
    }
  };

  useEffect(() => {
    async function loadInvoice() {
      setLoading(true);
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to load invoices:", error);
        toast.error(t("invoices.loadFailed"));
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, []);

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
                    <tr className="bg-[#f6f5f4] border-b border-gray-300">
                      <th>{t("invoices.client")}</th>
                      <th>{t("invoices.invoice")}</th>
                      <th className="text-center">{t("invoices.tasks")}</th>
                      <th className="text-center">{t("invoices.created")}</th>
                      <th className="text-center">{t("invoices.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-gray-300 hover:bg-gray-50 font-tt-chocolates"
                      >
                        <td>{invoice.client?.name || t("invoices.none")}</td>
                        <td>{invoice.name}</td>
                        <td className="text-center">
                          {invoice.tasks?.length || 0}
                        </td>
                        <td className="text-center">
                          {invoice.createdAt &&
                            new Date(invoice.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
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
