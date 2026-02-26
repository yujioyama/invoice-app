"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditableTasksTable from "@/components/invoice/EditableTasksTable";
import TotalSection from "@/components/invoice/TotalSection";
import { getClients } from "@/lib/apiClients";
import type { Client } from "@/lib/apiClients";
import { useTranslation } from "react-i18next";
import type { Currency, InvoiceLanguage } from "@/shared/types/Invoice";
import { useInvoiceTasks, type InvoiceTask } from "@/hooks/useInvoiceTasks";

function parseInitialTasks(value: string | null): InvoiceTask[] {
  if (!value) return [{ id: 1, name: "", rate: 27, hours: 0 }];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [{ id: 1, name: "", rate: 27, hours: 0 }];
    }
    return parsed;
  } catch {
    return [{ id: 1, name: "", rate: 27, hours: 0 }];
  }
}

function NewInvoiceForm({
  initialInvoiceName,
  initialTasks,
  initialClientId,
  initialCurrency,
  initialLanguage,
}: {
  initialInvoiceName: string;
  initialTasks: InvoiceTask[];
  initialClientId: string;
  initialCurrency: Currency;
  initialLanguage: InvoiceLanguage;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [invoiceName, setInvoiceName] = useState(initialInvoiceName);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<string>(initialClientId);
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [language, setLanguage] = useState<InvoiceLanguage>(initialLanguage);

  useEffect(() => {
    if (initialLanguage !== "en") return;
    const stored = window.localStorage.getItem(
      "lang",
    ) as InvoiceLanguage | null;
    if (stored === "en" || stored === "ja") {
      setLanguage(stored);
    }
  }, [initialLanguage]);

  const { tasks, grandTotal, areTasksValid, updateTask, addTask, deleteTask } =
    useInvoiceTasks({ initialTasks });

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    }
    fetchClients();
  }, []);

  // バリデーション
  const isValid = useMemo(() => {
    return !!clientId && areTasksValid;
  }, [areTasksValid, clientId]);

  // プレビュー遷移
  const handlePreview = useCallback(() => {
    if (!isValid) {
      alert(t("invoiceForm.previewAlert"));
      return;
    }

    const queryData = {
      name: invoiceName,
      clientId: clientId,
      currency,
      language,
      createdAt: new Date().toISOString(),
      tasks: JSON.stringify(tasks),
    };
    const queryString = new URLSearchParams(queryData).toString();
    router.push(`/invoices/preview?${queryString}`);
  }, [invoiceName, tasks, clientId, currency, language, isValid, router, t]);

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-[210mm]">
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t("invoiceForm.createTitle")}</h1>
            <p className="subtitle">{t("invoiceForm.createSubtitle")}</p>
          </div>

          <div className="card-body">
            {/* Invoice Name */}
            <div className="mb-6">
              <label className="label">{t("invoiceForm.invoiceName")}</label>
              <input
                type="text"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
                placeholder={t("invoiceForm.invoiceNamePlaceholder")}
                className="input"
              />
            </div>

            {/* Currency */}
            <div className="mb-6">
              <label className="label">{t("invoiceForm.currency")}</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="input"
              >
                {(["JPY", "USD", "EUR", "GBP", "AUD"] as Currency[]).map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Language */}
            <div className="mb-6">
              <label className="label">{t("invoiceForm.language")}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as InvoiceLanguage)}
                className="input"
              >
                <option value="en">{t("invoiceLanguage.en")}</option>
                <option value="ja">{t("invoiceLanguage.ja")}</option>
              </select>
            </div>

            {/* Client */}
            <div className="mb-6">
              <label className="label">{t("invoiceForm.client")}</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="input"
              >
                <option value="">{t("invoiceForm.clientPlaceholder")}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tasks Table */}
            <EditableTasksTable
              tasks={tasks}
              currency={currency}
              onTaskChange={updateTask}
              onTaskDelete={deleteTask}
            />

            {/* Add Task Button */}
            <div className="mb-6">
              <button onClick={addTask} className="btn btn-link">
                {t("invoiceForm.addTask")}
              </button>
            </div>

            {/* Grand Total */}
            <TotalSection total={grandTotal} currency={currency} />

            {/* Action Buttons */}
            <div className="flex gap-4 pb-9">
              <button
                onClick={handlePreview}
                disabled={!isValid}
                className="btn btn-primary"
                title={
                  !isValid
                    ? t("invoiceForm.previewDisabledTitle")
                    : t("invoiceForm.previewTitle")
                }
              >
                {t("invoiceForm.preview")}
              </button>
              <button
                onClick={() => router.push("/invoices")}
                className="btn btn-ghost"
              >
                {t("invoices.list")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  const searchParams = useSearchParams();
  const initialInvoiceName = searchParams.get("name") || "";
  const initialTasks = parseInitialTasks(searchParams.get("tasks"));
  const initialClientId = searchParams.get("clientId") || "";
  const initialCurrency = (searchParams.get("currency") as Currency) || "AUD";
  const initialLanguage =
    (searchParams.get("language") as InvoiceLanguage) || "en";

  return (
    <NewInvoiceForm
      key={searchParams.toString()}
      initialInvoiceName={initialInvoiceName}
      initialTasks={initialTasks}
      initialClientId={initialClientId}
      initialCurrency={initialCurrency}
      initialLanguage={initialLanguage}
    />
  );
}
