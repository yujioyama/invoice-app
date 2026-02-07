"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient, Client } from "@/lib/apiClients";
import { getMe } from "@/lib/apiAuth";

export default function NewInvoicePage() {
  const router = useRouter();
  const [client, setClient] = useState<Client>({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<{ id?: string }>({});

  useEffect(() => {
    async function fetchUser() {
      const data = await getMe();
      console.log("Fetched user data:", data);
      if (data?.user) {
        setUser(data.user);
      }
    }
    fetchUser();
  }, []);

  const isValid = useMemo(() => {
    return client.name.trim() !== "" && client.address!.trim() !== "";
  }, [client]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!user.id) throw new Error("No user information found");
      console.log("Fetched user data:", user);
      await createClient({
        userId: user.id,
        ...client,
      });

      router.push(`/clients`);
    } catch (error) {
      console.error("Failed to save client:", error);
      alert("failed to save. Please make sure the backend server is running.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-2xl">
        <div className="card">
          <div className="card-header">
            <h1 className="title">Create client</h1>
            <p className="subtitle">Add a new client to your account.</p>
          </div>

          <div className="card-body">
            {/* Name */}
            <div className="mb-6">
              <label className="label">Name</label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                placeholder="Enter client name..."
                className="input"
              />
            </div>
            {/* Address */}
            <div className="mb-6">
              <label className="label">Address</label>
              <input
                type="text"
                value={client.address}
                onChange={(e) =>
                  setClient({ ...client, address: e.target.value })
                }
                placeholder="Enter client address..."
                className="input"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="label">Email</label>
              <input
                type="text"
                value={client.email}
                onChange={(e) =>
                  setClient({ ...client, email: e.target.value })
                }
                placeholder="Enter client email..."
                className="input"
              />
            </div>
            {/* Phone */}
            <div className="mb-6">
              <label className="label">Phone</label>
              <input
                type="text"
                value={client.phone}
                onChange={(e) =>
                  setClient({ ...client, phone: e.target.value })
                }
                placeholder="Enter client phone..."
                className="input"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-9">
              <button
                onClick={handleSave}
                disabled={!isValid}
                className="btn btn-primary"
              >
                {saving ? "Saving..." : "Save & Continue"}
              </button>
              <button
                onClick={() => router.push("/clients")}
                className="btn btn-ghost"
              >
                Clients List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
