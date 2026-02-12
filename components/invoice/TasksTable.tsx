"use client";

import { useTranslation } from "react-i18next";

interface Task {
  name: string;
  rate: number;
  hours: number;
}

interface TasksTableProps {
  tasks: Task[];
}

export default function TasksTable({ tasks }: TasksTableProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-2">
      <table className="w-full">
        <thead>
          <tr className="text-base border-t border-b border-gray-300 font-now">
            <th
              className="py-3 font-bold tracking-wide text-left"
              style={{ width: 350, minWidth: 200, maxWidth: 400 }}
            >
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
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: Task, index: number) => (
            <tr
              key={index}
              className="border-b border-gray-300 font-tt-chocolates"
            >
              <td
                className="py-3 text-sm whitespace-normal break-words"
                style={{ width: 350, minWidth: 200, maxWidth: 400 }}
              >
                {task.name}
              </td>
              <td className="py-3 text-sm text-center">
                ${task.rate}
                {t("invoicePdf.perHour")}
              </td>
              <td className="py-3 text-sm text-center">{task.hours}</td>
              <td className="py-3 text-sm text-right">
                ${(task.rate * task.hours).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
