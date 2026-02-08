"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { createInvoice } from "@/lib/apiInvoices";
import { getMyDetails } from "@/lib/apiAuth";
import { getClientById } from "@/lib/apiClients";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import type { User } from "@/shared/types/User";
import type { Client } from "@/lib/apiClients";
import type { BankAccount } from "@/shared/types/BankAccount";

interface Task {
  name: string;
  rate: number;
  hours: number;
}

export default function PreviewInvoiceClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);

  // PDF出力対象の内容を参照
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getMyDetails();
      const fetchedUser = data?.user ?? null;
      setUser(fetchedUser);
      setUserId(fetchedUser?.id ?? null);
      setBankAccount(fetchedUser?.bankAccounts?.[0] ?? null);
    }
    fetchUser();
  }, []);

  // URLクエリから各種パラメータを取得
  const tasks = JSON.parse(searchParams.get("tasks") || "[]");
  const invoiceName = searchParams.get("name") || "Untitled Invoice";
  const createdAt = searchParams.get("createdAt") || new Date().toISOString();
  const clientId = searchParams.get("clientId") || "";
  const grandTotal = tasks.reduce(
    (sum: number, task: Task) => sum + task.rate * task.hours,
    0,
  );

  useEffect(() => {
    async function fetchClient() {
      if (!clientId) {
        setClient(null);
        return;
      }
      try {
        const data = await getClientById(clientId);
        setClient(data);
      } catch (error) {
        console.error("Failed to fetch client:", error);
        setClient(null);
      }
    }
    fetchClient();
  }, [clientId]);

  // プレビューからAPIで保存して詳細画面へ遷移
  const handleSave = async () => {
    setSaving(true);
    try {
      if (!userId) throw new Error("User session not found");
      const invoice = await createInvoice({
        name: invoiceName,
        userId: userId,
        clientId: clientId || null,
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

  const handleBackToEdit = () => {
    const queryData = {
      name: invoiceName,
      clientId: clientId,
      createdAt: createdAt,
      tasks: JSON.stringify(tasks),
    };
    const queryString = new URLSearchParams(queryData).toString();
    router.push(`/invoices/new?${queryString}`);
  };

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-[210mm] mb-6">
        <div className="flex flex-wrap gap-3">
          <button onClick={handleBackToEdit} className="btn btn-ghost">
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
        client={client}
        user={user}
        bankAccount={bankAccount}
      />
    </div>
  );
}
