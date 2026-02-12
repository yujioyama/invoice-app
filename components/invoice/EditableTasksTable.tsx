"use client";

import { useTranslation } from "react-i18next";

interface Task {
  id: number;
  name: string;
  rate: number;
  hours: number;
}

interface EditableTasksTableProps {
  tasks: Task[];
  onTaskChange: (id: number, field: keyof Task, value: string | number) => void;
  onTaskDelete: (id: number) => void;
}

export default function EditableTasksTable({
  tasks,
  onTaskChange,
  onTaskDelete,
}: EditableTasksTableProps) {
  const { t } = useTranslation();
  const calculateTotal = (rate: number, hours: number) => rate * hours;

  return (
    <div className="mb-6">
      <table className="w-full">
        <thead>
          <tr className="text-base border-t border-b border-gray-300 font-now text-black">
            <th className="py-3 font-bold tracking-wide text-left">
              {t("invoicePdf.task")}
            </th>
            <th className="py-3 font-bold tracking-wide text-center">
              {t("invoicePdf.rate")}
            </th>
            <th className="py-3 font-bold tracking-wide text-center">
              {t("invoicePdf.hours")}
            </th>
            <th className="py-3 font-bold tracking-wide text-right">
              {t("invoicePdf.total")}
            </th>
            <th className="py-3 font-bold tracking-wide text-center">
              {t("invoicePdf.action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-gray-300 font-tt-chocolates text-black"
            >
              <td className="py-3">
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) =>
                    onTaskChange(task.id, "name", e.target.value)
                  }
                  placeholder={t("invoicePdf.enterTaskName")}
                  className="w-full text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-gray-400 text-black"
                />
              </td>
              <td className="py-3 text-center">
                <input
                  type="number"
                  value={task.rate}
                  onChange={(e) =>
                    onTaskChange(task.id, "rate", Number(e.target.value))
                  }
                  min="0"
                  step="0.01"
                  className="w-20 text-sm text-center px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-gray-400 text-black"
                />
              </td>
              <td className="py-3 text-center">
                <input
                  type="number"
                  value={task.hours === 0 ? "" : task.hours}
                  onChange={(e) =>
                    onTaskChange(task.id, "hours", Number(e.target.value))
                  }
                  min="0"
                  step="1"
                  className="w-20 text-sm text-center px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-gray-400 text-black"
                />
              </td>
              <td className="py-3 text-sm text-right">
                ${calculateTotal(task.rate, task.hours).toFixed(2)}
              </td>
              <td className="py-3 text-center">
                <button
                  onClick={() => onTaskDelete(task.id)}
                  disabled={tasks.length === 1}
                  className="text-red-500 hover:text-red-700 text-sm disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  title={
                    tasks.length === 1
                      ? t("invoicePdf.atLeastOneTaskRequired")
                      : t("invoicePdf.deleteTaskTitle")
                  }
                >
                  {t("invoicePdf.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
