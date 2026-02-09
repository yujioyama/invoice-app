"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditableTasksTable from "@/components/invoice/EditableTasksTable";
import TotalSection from "@/components/invoice/TotalSection";
import { getClients } from "@/lib/apiClients";
import type { Client } from "@/lib/apiClients";
import { useTranslation } from "react-i18next";

type Task = {
  id: number;
  name: string;
  rate: number;
  hours: number;
};

function parseInitialTasks(value: string | null): Task[] {
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
}: {
  initialInvoiceName: string;
  initialTasks: Task[];
  initialClientId: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [invoiceName, setInvoiceName] = useState(initialInvoiceName);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<string>(initialClientId);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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

  // Grand Totalをメモ化
  const grandTotal = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.rate * task.hours, 0);
  }, [tasks]);

  // バリデーション
  const isValid = useMemo(() => {
    return (
      !!clientId && tasks.every((task) => task.name.trim() && task.hours > 0)
    );
  }, [tasks, clientId]);

  // タスク変更ハンドラーをメモ化
  const handleInputChange = useCallback(
    (id: number, field: keyof Task, value: string | number) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, [field]: value } : task,
        ),
      );
    },
    [],
  );

  // タスク追加をメモ化
  const addNewTask = useCallback(() => {
    setTasks((prevTasks) => {
      const newId =
        prevTasks.length > 0 ? prevTasks[prevTasks.length - 1].id + 1 : 1;
      return [...prevTasks, { id: newId, name: "", rate: 27, hours: 0 }];
    });
  }, []);

  // タスク削除をメモ化
  const deleteTask = useCallback((id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  // プレビュー遷移
  const handlePreview = useCallback(() => {
    if (!isValid) {
      alert(t("invoiceForm.previewAlert"));
      return;
    }

    const queryData = {
      name: invoiceName,
      clientId: clientId,
      createdAt: new Date().toISOString(),
      tasks: JSON.stringify(tasks),
    };
    const queryString = new URLSearchParams(queryData).toString();
    router.push(`/invoices/preview?${queryString}`);
  }, [invoiceName, tasks, clientId, isValid, router, t]);

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
              onTaskChange={handleInputChange}
              onTaskDelete={deleteTask}
            />

            {/* Add Task Button */}
            <div className="mb-6">
              <button onClick={addNewTask} className="btn btn-link">
                {t("invoiceForm.addTask")}
              </button>
            </div>

            {/* Grand Total */}
            <TotalSection total={grandTotal} />

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

  return (
    <NewInvoiceForm
      key={searchParams.toString()}
      initialInvoiceName={initialInvoiceName}
      initialTasks={initialTasks}
      initialClientId={initialClientId}
    />
  );
}
