"use client";

import { useState, useCallback, useMemo, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getInvoiceById, updateInvoice } from "@/lib/apiInvoices";
import { getClients } from "@/lib/apiClients";
import type { Client } from "@/lib/apiClients";
import EditableTasksTable from "@/components/invoice/EditableTasksTable";
import TotalSection from "@/components/invoice/TotalSection";

type Task = {
  id: number;
  name: string;
  rate: number;
  hours: number;
};

export default function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoiceName, setInvoiceName] = useState("");
  const [clientId, setClientId] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // 既存データの読み込み
  useEffect(() => {
    async function loadInvoice() {
      setLoading(true);
      try {
        const invoice = await getInvoiceById(resolvedParams.id);
        if (!invoice) {
          alert("Invoice not found.");
          router.push("/invoices");
          return;
        }
        setInvoiceName(invoice.name);
        setClientId(invoice.clientId || "");
        const clientsData = await getClients();
        setClients(clientsData);
        // DBから取得したタスクをローカル用フォーマットに変換
        const formattedTasks = (
          invoice.tasks as Array<{
            id: string;
            name: string;
            rate: number;
            hours: number;
          }>
        ).map((task, index) => ({
          id: index, // インデックスをIDとして使用
          name: task.name,
          rate: task.rate,
          hours: task.hours,
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Failed to load invoice:", error);
        alert("Failed to load invoice.");
        router.push("/invoices");
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  // Grand Totalをメモ化
  const grandTotal = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.rate * task.hours, 0);
  }, [tasks]);

  // バリデーション
  const isValid = useMemo(() => {
    return (
      invoiceName.trim() &&
      !!clientId &&
      tasks.every((task) => task.name.trim() && task.hours > 0)
    );
  }, [invoiceName, tasks, clientId]);

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
        prevTasks.length > 0 ? Math.max(...prevTasks.map((t) => t.id)) + 1 : 1;
      return [...prevTasks, { id: newId, name: "", rate: 27, hours: 0 }];
    });
  }, []);

  // タスク削除をメモ化
  const deleteTask = useCallback((id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  // 保存して詳細ページへ遷移
  const handleSave = useCallback(async () => {
    if (!isValid) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await updateInvoice(resolvedParams.id, {
        name: invoiceName,
        tasks: tasks.map((t) => ({
          name: t.name,
          rate: t.rate,
          hours: t.hours,
        })),
        clientId: clientId || null,
      });
      router.push(`/invoices/${resolvedParams.id}`);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Failed to save.");
    }
  }, [isValid, invoiceName, tasks, clientId, resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p className="text-slate-700">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-[210mm]">
        <div className="card">
          <div className="card-header">
            <h1 className="title">Edit invoice</h1>
            <p className="subtitle">Update invoice details and tasks.</p>
          </div>

          <div className="card-body">
            {/* Invoice Name */}
            <div className="mb-6">
              <label className="label">Invoice name</label>
              <input
                type="text"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
                placeholder="Enter invoice name..."
                className="input"
              />
            </div>

            {/* Client */}
            <div className="mb-6">
              <label className="label">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="input"
              >
                <option value="">Select a client...</option>
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
                + Add Task
              </button>
            </div>

            {/* Grand Total */}
            <TotalSection total={grandTotal} />

            {/* Action Buttons */}
            <div className="flex gap-4 pb-9">
              <button
                onClick={() => router.push(`/invoices/${resolvedParams.id}`)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid}
                className="btn btn-primary"
                title={!isValid ? "Please fill in all fields" : "Save changes"}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
