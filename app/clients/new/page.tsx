"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient, Client } from "@/lib/apiInvoices";

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

  // バリデーション
  const isValid = useMemo(() => {
    return client.name.trim() !== "" && client.address!.trim() !== "";
  }, [client]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) throw new Error("No user information found");
      const createdClient = await createClient({
        userId: user.id,
        ...client,
      });

      const queryData = {
        client: JSON.stringify(createdClient),
        createdAt: new Date().toISOString(),
      };
      const queryString = new URLSearchParams(queryData).toString();
      router.push(`/clients/${createdClient.id}?${queryString}`);
    } catch (error) {
      console.error("Failed to save client:", error);
      alert("failed to save. Please make sure the backend server is running.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-[210mm] mx-auto">
        <div className="bg-white shadow-lg">
          <h1 className="pt-11 pb-9 px-20 text-3xl font-bold tracking-widest bg-[#f6f5f4] font-tt-drugs text-black">
            CREATE CLIENT
          </h1>

          <div className="px-20 py-7">
            {/* Name */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold tracking-wide font-now text-black">
                NAME
              </label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                placeholder="Enter client name..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 font-tt-chocolates text-black"
              />
            </div>
            {/* Address */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold tracking-wide font-now text-black">
                Address
              </label>
              <input
                type="text"
                value={client.address}
                onChange={(e) =>
                  setClient({ ...client, address: e.target.value })
                }
                placeholder="Enter client address..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 font-tt-chocolates text-black"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold tracking-wide font-now text-black">
                EMAIL
              </label>
              <input
                type="text"
                value={client.email}
                onChange={(e) =>
                  setClient({ ...client, email: e.target.value })
                }
                placeholder="Enter client email..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 font-tt-chocolates text-black"
              />
            </div>
            {/* Phone */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold tracking-wide font-now text-black">
                Phone
              </label>
              <input
                type="text"
                value={client.phone}
                onChange={(e) =>
                  setClient({ ...client, phone: e.target.value })
                }
                placeholder="Enter client phone..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 font-tt-chocolates text-black"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-9">
              <button
                onClick={handleSave}
                disabled={!isValid}
                className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-now tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? "Saving..." : "Save & Continue"}
              </button>
              <button
                onClick={() => router.push("/clients")}
                className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
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
