export type Task = { name: string; rate: number; hours: number };
export type Invoice = {
  id: string;
  name: string;
  createdAt: string;
  tasks: Task[];
};

const STORAGE_KEY = "invoice-app:invoices";

export function generateInvoiceId(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);
  const ts = Date.now();
  return `${slug || "invoice"}-${ts}`;
}

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
  } catch {
    return [];
  }
}

export function saveInvoice(invoice: Invoice) {
  if (typeof window === "undefined") return;
  const current = getInvoices();
  const idx = current.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) {
    current[idx] = invoice;
  } else {
    current.push(invoice);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function getInvoiceById(id: string): Invoice | null {
  const list = getInvoices();
  return list.find((i) => i.id === id) || null;
}
