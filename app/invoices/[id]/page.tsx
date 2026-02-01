"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getInvoiceById } from "@/lib/apiInvoices";
import type { Invoice } from "@/lib/apiInvoices";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";

interface Task {
  name: string;
  rate: number;
  hours: number;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadInvoice() {
      setLoading(true);
      try {
        const data = await getInvoiceById(resolvedParams.id);
        setInvoice(data);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [resolvedParams.id]);

  const downloadPDF = async () => {
    if (!invoice) return;
    try {
      const res = await fetch(`/api/invoices/${resolvedParams.id}/pdf`);
      if (!res.ok) throw new Error("PDF download failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${invoice.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to download the PDF.");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p className="text-slate-700">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h1 className="title">Invoice not found</h1>
              <p className="subtitle">
                Please make sure the backend server is running.
              </p>
            </div>
            <div className="card-body">
              <button
                onClick={() => router.push("/invoices/new")}
                className="btn btn-primary"
              >
                Create New Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tasks: Task[] = invoice.tasks as Task[];
  const grandTotal = tasks.reduce((sum, t) => sum + t.rate * t.hours, 0);

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-[210mm]">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/invoices/${resolvedParams.id}/edit`)}
            className="btn btn-secondary"
          >
            Edit Invoice
          </button>
          <button onClick={downloadPDF} className="btn btn-primary">
            Download PDF
          </button>
          <button
            onClick={() => router.push("/invoices")}
            className="btn btn-ghost"
          >
            Invoices List
          </button>
        </div>
      </div>

      <InvoiceDocument
        ref={invoiceRef}
        invoiceName={invoice.name}
        createdAt={invoice.createdAt}
        tasks={tasks}
        grandTotal={grandTotal}
      />
    </div>
  );
}
