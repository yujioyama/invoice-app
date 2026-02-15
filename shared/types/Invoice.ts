import type { Client } from "./Client";

export type Currency = "JPY" | "USD" | "EUR" | "GBP" | "AUD";

export type Task = {
  name: string;
  rate: number;
  hours: number;
};

// UI用（編集テーブルなど）: クライアント側で識別するためのid付き
export type InvoiceTask = Task & {
  id: number;
};

export type Invoice = {
  id: string;
  name: string;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  clientId?: string | null;
  client?: Client | null;
};

export type CreateInvoiceInput = {
  name: string;
  userId: string;
  tasks: Task[];
  currency?: Currency;
  clientId?: string | null;
};
