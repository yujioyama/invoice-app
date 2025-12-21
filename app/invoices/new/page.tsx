"use client";

import { useState } from "react";

type Task = {
  id: number;
  name: string;
  rate: number;
  hours: number;
};

export default function NewInvoicePage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "", rate: 27, hours: 0 },
  ]);

  // 合計金額の計算
  const calculateTotal = (rate: number, hours: number) => rate * hours;

  // 全体の合計金額を計算
  const calculateGrandTotal = () =>
    tasks.reduce((sum, task) => sum + calculateTotal(task.rate, task.hours), 0);

  // タスクのフィールド変更時の処理
  const handleInputChange = (
    id: number,
    field: keyof Task,
    value: string | number
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, [field]: typeof value === "number" ? value : value }
          : task
      )
    );
  };

  // タスクを追加
  const addNewTask = () => {
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    setTasks([...tasks, { id: newId, name: "", rate: 27, hours: 0 }]);
  };

  // タスクを削除
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create New Invoice</h1>
      <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Task Name</th>
            <th className="border border-gray-300 px-4 py-2">Rate ($/hr)</th>
            <th className="border border-gray-300 px-4 py-2">Hours</th>
            <th className="border border-gray-300 px-4 py-2">Total</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) =>
                    handleInputChange(task.id, "name", e.target.value)
                  }
                  className="border p-2 w-full"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={task.rate}
                  onChange={(e) =>
                    handleInputChange(task.id, "rate", Number(e.target.value))
                  }
                  className="border p-2 w-full"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={task.hours}
                  onChange={(e) =>
                    handleInputChange(task.id, "hours", Number(e.target.value))
                  }
                  className="border p-2 w-full"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                ${calculateTotal(task.rate, task.hours).toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addNewTask}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Task
      </button>
      <h2 className="text-lg font-bold mt-4">
        Grand Total: ${calculateGrandTotal().toFixed(2)}
      </h2>
    </div>
  );
}
