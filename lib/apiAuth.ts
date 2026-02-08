const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function verifyEmail(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/verifyEmail?token=${token}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("failed to verify email");
  return res.json();
}

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

export async function logout() {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("failed to logout");
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getMyDetails() {
  const res = await fetch(`${API_BASE_URL}/auth/me/details`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateMyDetails(data: {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  // bank account fields
  bankAccount?: {
    id?: string;
    accountName?: string;
    branchCode?: string;
    accountNumber?: string;
    swiftBic?: string;
    bank?: string;
    branchAddress?: string;
    currency?: string;
    intermediaryBank?: string;
  };
}) {
  const res = await fetch(`${API_BASE_URL}/auth/me/details`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("failed to update details");
  return res.json();
}
