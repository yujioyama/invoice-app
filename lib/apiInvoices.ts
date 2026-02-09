import type { Task, Invoice, CreateInvoiceInput } from "@/shared/types/Invoice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type { Task, Invoice };

export async function createInvoice(
  data: CreateInvoiceInput,
): Promise<Invoice> {
  const res = await fetch(`${API_BASE_URL}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create invoice");
  return res.json();
}

export async function getInvoices(): Promise<Invoice[]> {
  const res = await fetch(`${API_BASE_URL}/invoices`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const res = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    credentials: "include",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch invoice");
  return res.json();
}

export async function updateInvoice(
  id: string,
  data: { name?: string; tasks?: Task[]; clientId?: string | null },
): Promise<Invoice> {
  const res = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update invoice");
  return res.json();
}

export async function deleteInvoice(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete invoice");
}
