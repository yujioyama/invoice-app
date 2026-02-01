"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { createInvoice } from "@/lib/apiInvoices";
import { getMe } from "@/lib/apiAuth";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";

interface Task {
  name: string;
  rate: number;
  hours: number;
}

export default function PreviewInvoiceClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // PDF出力対象の内容を参照
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getMe();
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    }
    fetchUser();
  }, []);

  // URLクエリから各種パラメータを取得
  const tasks = JSON.parse(searchParams.get("tasks") || "[]");
  const invoiceName = searchParams.get("name") || "Untitled Invoice";
  const createdAt = searchParams.get("createdAt") || new Date().toISOString();
  const grandTotal = tasks.reduce(
    (sum: number, task: Task) => sum + task.rate * task.hours,
    0,
  );

  // プレビューからAPIで保存して詳細画面へ遷移
  const handleSave = async () => {
    setSaving(true);
    try {
      if (!userId) throw new Error("User session not found");
      const invoice = await createInvoice({
        name: invoiceName,
        userId: userId,
        tasks: tasks.map((t: Task) => ({
          name: t.name,
          rate: t.rate,
          hours: t.hours,
        })),
      });
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Failed to save. Please make sure the backend server is running.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-[210mm] mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/invoices/new")}
            className="btn btn-ghost"
          >
            Back to Edit
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>

      {/* PDF出力対象要素 */}
      <InvoiceDocument
        ref={invoiceRef}
        invoiceName={invoiceName}
        createdAt={createdAt}
        tasks={tasks}
        grandTotal={grandTotal}
      />
    </div>
  );
}
