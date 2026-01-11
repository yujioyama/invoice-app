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
          task.id === id ? { ...task, [field]: value } : task
        )
      );
    },
    []
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
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-[210mm] mx-auto">
        <div className="bg-white shadow-lg">
          <h1 className="pt-11 pb-9 px-20 text-3xl font-bold tracking-widest bg-[#f6f5f4] font-tt-drugs text-black">
            CREATE INVOICE
          </h1>

          <div className="px-20 py-7">
            {/* Invoice Name */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold tracking-wide font-now text-black">
                INVOICE NAME
              </label>
              <input
                type="text"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
                placeholder="Enter invoice name..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 font-tt-chocolates text-black"
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
              <button
                onClick={addNewTask}
                className="text-sm text-blue-600 hover:text-blue-800 font-now tracking-wide cursor-pointer"
              >
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
                className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-now tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
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
                className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
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
