"use client";

import { useTranslation } from "react-i18next";
import type { Currency, Task } from "@/shared/types/Invoice";
import { formatCurrency } from "@/lib/formatCurrency";

interface TasksTableProps {
  tasks: Task[];
  currency: Currency;
}

export default function TasksTable({ tasks, currency }: TasksTableProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ja") ? "ja-JP" : "en-GB";

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
          {tasks.map((task, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 font-tt-chocolates"
            >
              <td
                className="py-3 text-sm whitespace-normal wrap-break-word"
                style={{ width: 350, minWidth: 200, maxWidth: 400 }}
              >
                {task.name}
              </td>
              <td className="py-3 text-sm text-center">
                {formatCurrency(task.rate, currency, locale)}
                {t("invoicePdf.perHour")}
              </td>
              <td className="py-3 text-sm text-center">{task.hours}</td>
              <td className="py-3 text-sm text-right">
                {formatCurrency(task.rate * task.hours, currency, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
