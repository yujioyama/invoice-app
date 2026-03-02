"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { createInvoice } from "@/lib/apiInvoices";
import { getMyDetails } from "@/lib/apiAuth";
import { getClientById } from "@/lib/apiClients";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import { InvoiceLanguageProvider } from "@/components/invoice/InvoiceLanguageProvider";
import type { User } from "@/shared/types/User";
import type { Client } from "@/lib/apiClients";
import type { BankAccount } from "@/shared/types/BankAccount";
import { useTranslation } from "react-i18next";
import type { Currency, InvoiceLanguage, Task } from "@/shared/types/Invoice";
import { useAsyncAction } from "@/hooks/useAsyncAction";

const PDF_PAYLOAD_STORAGE_KEY = "invoice_pdf_payload_v1";

type PdfPayload = {
  invoice: {
    name: string;
    createdAt: string;
    currency: Currency;
    language: InvoiceLanguage;
  };
  tasks: Task[];
  client: Client | null;
  user: User | null;
  bankAccount: BankAccount | null;
};

export default function PreviewInvoiceClient() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [pdfPayload, setPdfPayload] = useState<PdfPayload | null>(null);

  const { run: saveInvoice, loading: saving } = useAsyncAction(createInvoice);

  // PDF出力対象の内容を参照
  const invoiceRef = useRef<HTMLDivElement>(null);

  const isPdfMode = searchParams.get("pdf") === "1";

  useEffect(() => {
    if (!isPdfMode) return;
    try {
      const raw = window.localStorage.getItem(PDF_PAYLOAD_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PdfPayload;
      setPdfPayload(parsed);
      window.localStorage.removeItem(PDF_PAYLOAD_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to parse PDF payload:", error);
    }
  }, [isPdfMode]);

  useEffect(() => {
    if (isPdfMode) return;
    async function fetchUser() {
      const data = await getMyDetails();
      const fetchedUser = data?.user ?? null;
      setUser(fetchedUser);
      setUserId(fetchedUser?.id ?? null);
      setBankAccount(fetchedUser?.bankAccounts?.[0] ?? null);
    }
    fetchUser();
  }, [isPdfMode]);

  // URLクエリから各種パラメータを取得
  const tasks = isPdfMode
    ? (pdfPayload?.tasks ?? [])
    : (JSON.parse(searchParams.get("tasks") || "[]") as Task[]);
  const invoiceName = isPdfMode
    ? (pdfPayload?.invoice.name ?? "")
    : searchParams.get("name") || t("invoicePreview.untitled");
  const createdAt = isPdfMode
    ? (pdfPayload?.invoice.createdAt ?? new Date().toISOString())
    : searchParams.get("createdAt") || new Date().toISOString();
  const clientId = searchParams.get("clientId") || "";
  const currency = isPdfMode
    ? (pdfPayload?.invoice.currency ?? "JPY")
    : (searchParams.get("currency") as Currency) || "JPY";
  const language = isPdfMode
    ? (pdfPayload?.invoice.language ?? "en")
    : (searchParams.get("language") as InvoiceLanguage) || "en";
  const grandTotal = tasks.reduce(
    (sum, task) => sum + task.rate * task.hours,
    0,
  );

  useEffect(() => {
    if (isPdfMode) return;
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
  }, [clientId, isPdfMode]);

  const effectiveClient = isPdfMode ? (pdfPayload?.client ?? null) : client;
  const effectiveUser = isPdfMode ? (pdfPayload?.user ?? null) : user;
  const effectiveBankAccount = isPdfMode
    ? (pdfPayload?.bankAccount ?? null)
    : bankAccount;

  // プレビューからAPIで保存して詳細画面へ遷移
  const handleSave = async () => {
    try {
      if (!userId) throw new Error(t("invoicePreview.userSessionNotFound"));
      const invoice = await saveInvoice({
        name: invoiceName,
        userId: userId,
        currency,
        language,
        clientId: clientId || null,
        tasks: tasks.map((t) => ({
          name: t.name,
          rate: t.rate,
          hours: t.hours,
        })),
      });
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert(t("invoicePreview.saveFailedWithBackend"));
    }
  };

  const handleBackToEdit = () => {
    const queryData = {
      name: invoiceName,
      clientId: clientId,
      currency,
      language,
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
            {t("invoicePreview.backToEdit")}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving
              ? t("invoicePreview.saving")
              : t("invoicePreview.saveContinue")}
          </button>
        </div>
      </div>

      {/* PDF出力対象要素 */}
      <InvoiceLanguageProvider language={language}>
        {isPdfMode && !pdfPayload ? null : (
          <InvoiceDocument
            ref={invoiceRef}
            invoiceName={invoiceName}
            createdAt={createdAt}
            tasks={tasks}
            grandTotal={grandTotal}
            currency={currency}
            client={effectiveClient}
            user={effectiveUser}
            bankAccount={effectiveBankAccount}
          />
        )}
      </InvoiceLanguageProvider>
    </div>
  );
}
