const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function register(email: string, name: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("failed to register");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("failed to login");
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}
