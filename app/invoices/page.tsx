"use client";

import { useRouter } from "next/navigation";
import { getInvoices, Invoice } from "@/lib/apiInvoices";
import { useEffect, useState } from "react";

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
      <div className="min-h-screen p-8 bg-gray-50">
        <p className="text-black">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-widest text-black font-tt-drugs mb-2">
            INVOICES
          </h1>
          <p className="text-sm text-black font-tt-chocolates">
            Manage and view all your invoices
          </p>
        </div>

        {/* New Invoice Button */}
        <div className="mb-6">
          <button
            onClick={handleNewInvoice}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-now tracking-wide cursor-pointer"
          >
            + New Invoice
          </button>
        </div>

        {/* Invoices List */}
        {invoices && invoices.length > 0 ? (
          <div className="bg-white shadow-lg rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f6f5f4] border-b border-gray-300">
                  <th className="px-6 py-4 text-left font-bold tracking-wide font-now text-black">
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-center font-bold tracking-wide font-now text-black">
                    Tasks
                  </th>
                  <th className="px-6 py-4 text-center font-bold tracking-wide font-now text-black">
                    Created
                  </th>
                  <th className="px-6 py-4 text-center font-bold tracking-wide font-now text-black">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-300 hover:bg-gray-50 font-tt-chocolates"
                  >
                    <td className="px-6 py-4 text-black">{invoice.name}</td>
                    <td className="px-6 py-4 text-center text-black">
                      {invoice.tasks?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-black">
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
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDetail(invoice.id)}
                        className="px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded p-8 text-center">
            <p className="text-black font-tt-chocolates mb-4">
              No invoices found. Create your first invoice!
            </p>
            <button
              onClick={handleNewInvoice}
              className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-now tracking-wide cursor-pointer"
            >
              Create Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
