"use client";

import { useRouter } from "next/navigation";
import { getClients, Client } from "@/lib/apiClients";
import { useEffect, useState } from "react";
import { deleteClient } from "@/lib/apiClients";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function InvoicesListPage() {
  const { t } = useTranslation();
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
        t("clients.deleted", {
          name: clientName ? ` "${clientName}"` : "",
        }),
      );
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error(t("clients.deleteFailed"));
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
        toast.error(t("clients.loadFailed"));
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, [t]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p className="text-slate-700">{t("clients.loading")}</p>
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
              <h1 className="title">{t("clients.title")}</h1>
              <p className="subtitle">{t("clients.subtitle")}</p>
            </div>
            <button onClick={handleNewClient} className="btn btn-primary">
              {t("clients.new")}
            </button>
          </div>

          <div className="card-body">
            {clients && clients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-[#f6f5f4] border-b border-gray-300">
                      <th>{t("clients.name")}</th>
                      <th className="text-center">{t("clients.email")}</th>
                      <th className="text-center">{t("clients.phone")}</th>
                      <th className="text-center">{t("clients.address")}</th>
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
                            {t("clients.delete")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-700 mb-4">{t("clients.empty")}</p>
                <button onClick={handleNewClient} className="btn btn-primary">
                  {t("clients.create")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
