"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createInvoice } from "@/lib/api";
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

  // PDF出力対象の内容を参照
  const invoiceRef = useRef<HTMLDivElement>(null);

  // URLクエリから各種パラメータを取得
  const tasks = JSON.parse(searchParams.get("tasks") || "[]");
  const invoiceName = searchParams.get("name") || "Untitled Invoice";
  const createdAt = searchParams.get("createdAt") || new Date().toISOString();
  const grandTotal = tasks.reduce(
    (sum: number, task: Task) => sum + task.rate * task.hours,
    0
  );

  // プレビューからAPIで保存して詳細画面へ遷移
  const handleSave = async () => {
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) throw new Error("ユーザー情報が見つかりません");
      const invoice = await createInvoice({
        name: invoiceName,
        userId: user.id,
        tasks: tasks.map((t: Task) => ({
          name: t.name,
          rate: t.rate,
          hours: t.hours,
        })),
      });
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert(
        "保存に失敗しました。バックエンドサーバーが起動しているか確認してください。"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-[210mm] mx-auto mb-8">
        {/* 操作ボタン */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => router.push("/invoices/new")}
            className="px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
          >
            Back to Edit
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
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
