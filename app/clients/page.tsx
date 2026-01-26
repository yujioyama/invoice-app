"use client";

import { useRouter } from "next/navigation";
import { getClients, Client } from "@/lib/apiClients";
import { useEffect, useState } from "react";

export default function InvoicesListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[] | null>(null);

  const handleNewClient = () => {
    router.push("/clients/new");
  };

  useEffect(() => {
    async function loadClients() {
      setLoading(true);
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Failed to load clients:", error);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <p className="text-[#000]">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-widest text-[#000] font-tt-drugs mb-2">
            CLIENTS
          </h1>
          <p className="text-sm text-[#000] font-tt-chocolates">
            Manage and view all your clients
          </p>
        </div>

        {/* New Client Button */}
        <div className="mb-6">
          <button
            onClick={handleNewClient}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-now tracking-wide cursor-pointer"
          >
            + New Client
          </button>
        </div>

        {/* Clients List */}
        {clients && clients.length > 0 ? (
          <div className="bg-white shadow-lg rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f6f5f4] border-b border-gray-300">
                  <th className="px-6 py-4 text-left font-bold tracking-wide font-now text-[#000]">
                    Name
                  </th>
                  <th className="px-6 py-4 text-center font-bold tracking-wide font-now text-[#000]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center font-bold tracking-wide font-now text-[#000]">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-center font-bold tracking-wide font-now text-[#000]">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-gray-300 hover:bg-gray-50 font-tt-chocolates"
                  >
                    <td className="px-6 py-4 text-[#000]">{client.name}</td>
                    <td className="px-6 py-4 text-[#000]">{client.email}</td>
                    <td className="px-6 py-4 text-[#000]">{client.phone}</td>
                    <td className="px-6 py-4 text-[#000]">{client.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded p-8 text-center">
            <p className="text-[#000] font-tt-chocolates mb-4">
              No clients found. Create your first client!
            </p>
            <button
              onClick={handleNewClient}
              className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-now tracking-wide cursor-pointer"
            >
              Create Client
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
