"use client";

import { useRouter } from "next/navigation";
import { getInvoices, Invoice } from "@/lib/apiInvoices";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { deleteInvoice } from "@/lib/apiInvoices";

export default function InvoicesListPage() {
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
        `Invoice${invoiceName ? ` "${invoiceName}"` : ""} has been deleted.`,
      );
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Failed to delete invoice");
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
          <p className="text-slate-700">Loading invoices...</p>
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
              <h1 className="title">Invoices</h1>
              <p className="subtitle">Manage and view all your invoices</p>
            </div>
            <button onClick={handleNewInvoice} className="btn btn-primary">
              + New Invoice
            </button>
          </div>

          <div className="card-body">
            {invoices && invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-[#f6f5f4] border-b border-gray-300">
                      <th>Invoice</th>
                      <th className="text-center">Tasks</th>
                      <th className="text-center">Created</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-gray-300 hover:bg-gray-50 font-tt-chocolates"
                      >
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
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="btn btn-danger ml-2"
                            >
                              Delete
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
                <p className="text-slate-700 mb-4">
                  No invoices found. Create your first invoice!
                </p>
                <button onClick={handleNewInvoice} className="btn btn-primary">
                  Create Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
