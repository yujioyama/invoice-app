"use client";

import { useState, useCallback, useMemo, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getInvoiceById, updateInvoice } from "@/lib/api";
import type { Invoice } from "@/lib/api";
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
  const [tasks, setTasks] = useState<Task[]>([]);

  // 既存データの読み込み
  useEffect(() => {
    async function loadInvoice() {
      setLoading(true);
      try {
        const invoice = await getInvoiceById(resolvedParams.id);
        if (!invoice) {
          alert("インボイスが見つかりません。");
          router.push("/invoices");
          return;
        }
        setInvoiceName(invoice.name);

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
        alert("インボイスの読み込みに失敗しました。");
        router.push("/invoices");
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [resolvedParams.id, router]);

  // Grand Totalをメモ化
  const grandTotal = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.rate * task.hours, 0);
  }, [tasks]);

  // バリデーション
  const isValid = useMemo(() => {
    return (
      invoiceName.trim() &&
      tasks.every((task) => task.name.trim() && task.hours > 0)
    );
  }, [invoiceName, tasks]);

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
      });
      router.push(`/invoices/${resolvedParams.id}`);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("保存に失敗しました。");
    }
  }, [isValid, invoiceName, tasks, resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-black">Loading invoice...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-[210mm] mx-auto">
        <div className="bg-white shadow-lg">
          <h1 className="pt-11 pb-9 px-20 text-3xl font-bold tracking-widest bg-[#f6f5f4] font-tt-drugs text-black">
            EDIT INVOICE
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
                onClick={() => router.push(`/invoices/${resolvedParams.id}`)}
                className="px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 font-now tracking-wide cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid}
                className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-now tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
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
