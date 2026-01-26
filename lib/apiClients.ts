import type { Client, CreateClientInput } from "@/shared/types/Client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type { Client };

export async function createClient(data: CreateClientInput): Promise<Client> {
  const res = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create client");
  return res.json();
}

export async function getClients(): Promise<Client[]> {
  const res = await fetch(`${API_BASE_URL}/clients`);
  if (!res.ok) throw new Error("Failed to fetch clients");
  return res.json();
}

export async function getClientById(id: string): Promise<Client | null> {
  const res = await fetch(`${API_BASE_URL}/clients/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch client");
  return res.json();
}

export async function updateClient(
  id: string,
  data: { name?: string },
): Promise<Client> {
  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update client");
  return res.json();
}

export async function deleteClient(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete client");
}
