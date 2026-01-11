"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getInvoiceById } from "@/lib/api";
import type { Invoice } from "@/lib/api";
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
      alert("PDFのダウンロードに失敗しました。");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Loading...</h1>
        <p className="text-gray-600">インボイスを読み込んでいます...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Invoice Not Found</h1>
        <p className="mb-6 text-gray-600">
          インボイスデータが見つかりませんでした。バックエンドサーバーが起動しているか確認してください。
        </p>
        <button
          onClick={() => router.push("/invoices/new")}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Create New Invoice
        </button>
      </div>
    );
  }

  const tasks: Task[] = invoice.tasks as Task[];
  const grandTotal = tasks.reduce((sum, t) => sum + t.rate * t.hours, 0);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-[210mm] mx-auto mb-8">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => router.push(`/invoices/${resolvedParams.id}/edit`)}
            className="px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
          >
            Edit Invoice
          </button>
          <button
            onClick={downloadPDF}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
          >
            Download PDF
          </button>
          <button
            onClick={() => router.push("/invoices")}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
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
