"use client";

import { useState, useCallback, useMemo, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateInvoice } from "@/lib/apiInvoices";
import toast from "react-hot-toast";
import type { Client } from "@/lib/apiClients";
import EditableTasksTable from "@/components/invoice/EditableTasksTable";
import TotalSection from "@/components/invoice/TotalSection";
import { useTranslation } from "react-i18next";
import type { Currency, InvoiceLanguage } from "@/shared/types/Invoice";
import { useInvoiceTasks, type InvoiceTask } from "@/hooks/useInvoiceTasks";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useInvoiceEditData } from "@/hooks/useInvoiceEditData";
import LoadingPage from "@/components/ui/LoadingPage";

function formatInvoiceTasksForEdit(invoice: {
  tasks: Array<{ name: string; rate: number; hours: number }>;
}): InvoiceTask[] {
  return invoice.tasks.map((task, index) => ({
    id: index,
    name: task.name,
    rate: task.rate,
    hours: task.hours,
  }));
}

function EditInvoiceForm({
  invoiceId,
  invoice,
  clients,
}: {
  invoiceId: string;
  invoice: {
    name: string;
    currency?: Currency;
    language?: InvoiceLanguage;
    clientId?: string | null;
    tasks: Array<{ name: string; rate: number; hours: number }>;
  };
  clients: Client[];
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [invoiceName, setInvoiceName] = useState(invoice.name);
  const [currency, setCurrency] = useState<Currency>(invoice.currency || "AUD");
  const [clientId, setClientId] = useState<string>(invoice.clientId || "");
  const [language, setLanguage] = useState<InvoiceLanguage>(
    invoice.language || "en",
  );

  const initialTasks = useMemo(
    () => formatInvoiceTasksForEdit(invoice),
    [invoice],
  );

  const { run: saveInvoice, loading: saving } = useAsyncAction(
    async (payload: {
      name: string;
      currency: Currency;
      language: InvoiceLanguage;
      tasks: Array<{ name: string; rate: number; hours: number }>;
      clientId: string | null;
    }) => updateInvoice(invoiceId, payload),
  );

  const { tasks, grandTotal, areTasksValid, updateTask, addTask, deleteTask } =
    useInvoiceTasks({ initialTasks });

  const isValid = useMemo(() => {
    return invoiceName.trim() && !!clientId && areTasksValid;
  }, [invoiceName, areTasksValid, clientId]);

  const handleSave = useCallback(async () => {
    if (!isValid) {
      toast.error(t("invoiceEdit.fillAllFields"));
      return;
    }

    try {
      await saveInvoice({
        name: invoiceName,
        currency,
        language,
        tasks: tasks.map((t) => ({
          name: t.name,
          rate: t.rate,
          hours: t.hours,
        })),
        clientId: clientId || null,
      });
      router.push(`/invoices/${invoiceId}`);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      toast.error(t("invoiceEdit.saveFailed"));
    }
  }, [
    clientId,
    currency,
    language,
    invoiceId,
    invoiceName,
    isValid,
    router,
    saveInvoice,
    t,
    tasks,
  ]);

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-[210mm]">
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t("invoiceEdit.title")}</h1>
            <p className="subtitle">{t("invoiceEdit.subtitle")}</p>
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
                onClick={() => router.push(`/invoices/${invoiceId}`)}
                className="btn btn-ghost"
              >
                {t("invoiceEdit.cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || saving}
                className="btn btn-primary"
                title={
                  !isValid
                    ? t("invoiceEdit.fillAllFields")
                    : t("invoiceEdit.saveChanges")
                }
              >
                {t("invoiceEdit.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useTranslation();
  const resolvedParams = use(params);
  const router = useRouter();
  const notFoundHandledRef = useRef(false);

  const { data, loading } = useInvoiceEditData(resolvedParams.id);

  useEffect(() => {
    if (loading) return;
    if (data !== null) return;
    if (notFoundHandledRef.current) return;
    notFoundHandledRef.current = true;
    toast.error(t("invoiceEdit.invoiceNotFound"));
    router.push("/invoices");
  }, [data, loading, router, t]);

  if (loading) {
    return <LoadingPage message={t("invoiceDetail.loading")} />;
  }

  if (!data) return null;

  return (
    <EditInvoiceForm
      key={resolvedParams.id}
      invoiceId={resolvedParams.id}
      invoice={data.invoice}
      clients={data.clients}
    />
  );
}
