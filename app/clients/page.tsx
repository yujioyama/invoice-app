"use client";

import { useRouter } from "next/navigation";
import { getClients, Client } from "@/lib/apiClients";
import { useEffect, useState } from "react";
import { deleteClient } from "@/lib/apiClients";
import toast from "react-hot-toast";

export default function InvoicesListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[] | null>(null);

  const handleNewClient = () => {
    router.push("/clients/new");
  };

  const handleDeleteClient = async (id: string) => {
    const clientName = clients?.find((client) => client.id === id)?.name || "";
    try {
      await deleteClient(id);
      setClients(
        (prevClients) =>
          prevClients?.filter((client) => client.id !== id) || null,
      );
      toast.success(
        `Client${clientName ? ` "${clientName}"` : ""} has been deleted.`,
      );
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error("Failed to delete client");
    }
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
      <div className="page">
        <div className="container">
          <p className="text-slate-700">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="card-header flex items-center justify-between gap-4">
            <div>
              <h1 className="title">Clients</h1>
              <p className="subtitle">Manage and view all your clients</p>
            </div>
            <button onClick={handleNewClient} className="btn btn-primary">
              + New Client
            </button>
          </div>

          <div className="card-body">
            {clients && clients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-[#f6f5f4] border-b border-gray-300">
                      <th>Name</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Phone</th>
                      <th className="text-center">Address</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-gray-300 hover:bg-gray-50 font-tt-chocolates"
                      >
                        <td>{client.name}</td>
                        <td className="text-right">{client.email}</td>
                        <td className="text-right">{client.phone}</td>
                        <td className="text-right">{client.address}</td>
                        <td className="text-right">
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-700 mb-4">
                  No clients found. Create your first client!
                </p>
                <button onClick={handleNewClient} className="btn btn-primary">
                  Create Client
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
