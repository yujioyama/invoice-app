"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import EditableTasksTable from "@/components/invoice/EditableTasksTable";
import TotalSection from "@/components/invoice/TotalSection";

type Task = {
  id: number;
  name: string;
  rate: number;
  hours: number;
};

export default function NewInvoicePage() {
  const router = useRouter();
  const [invoiceName, setInvoiceName] = useState("My First Invoice");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "", rate: 27, hours: 0 },
  ]);

  // Grand Totalをメモ化
  const grandTotal = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.rate * task.hours, 0);
  }, [tasks]);

  // バリデーション
  const isValid = useMemo(() => {
    return tasks.every((task) => task.name.trim() && task.hours > 0);
  }, [tasks]);

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
      alert("Please fill in all task names and hours before previewing.");
      return;
    }

    const queryData = {
      name: invoiceName,
      createdAt: new Date().toISOString(),
      tasks: JSON.stringify(tasks),
    };
    const queryString = new URLSearchParams(queryData).toString();
    router.push(`/invoices/preview?${queryString}`);
  }, [invoiceName, tasks, isValid, router]);

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-[210mm]">
        <div className="card">
          <div className="card-header">
            <h1 className="title">Create invoice</h1>
            <p className="subtitle">
              Build your invoice and preview it before saving.
            </p>
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
                onClick={handlePreview}
                disabled={!isValid}
                className="btn btn-primary"
                title={
                  !isValid
                    ? "Please fill in all task names and hours"
                    : "Preview invoice"
                }
              >
                Preview Invoice
              </button>
              <button
                onClick={() => router.push("/invoices")}
                className="btn btn-ghost"
              >
                Invoices List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
