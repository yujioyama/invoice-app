"use client";

import { useRouter } from "next/navigation";
import { getClients } from "@/lib/apiClients";
import { useEffect, useState } from "react";
import { deleteClient } from "@/lib/apiClients";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useAsyncLoad } from "@/hooks/useAsyncLoad";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export default function InvoicesListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    data: clients,
    setData: setClients,
    loading,
    run: loadClients,
  } = useAsyncLoad(getClients, {
    initialData: null,
    initialLoading: true,
    onError: () => toast.error(t("clients.loadFailed")),
  });

  const { run: runDeleteClient } = useAsyncAction(deleteClient);

  const handleNewClient = () => {
    router.push("/clients/new");
  };

  const handleDeleteClient = async (id: string) => {
    const clientName = clients?.find((client) => client.id === id)?.name || "";
    setDeletingId(id);
    try {
      await runDeleteClient(id);
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
    } finally {
      setDeletingId((prev) => (prev === id ? null : prev));
    }
  };

  useEffect(() => {
    loadClients().catch((error) => {
      console.error("Failed to load clients:", error);
    });
  }, [loadClients]);

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
                    <tr>
                      <th>{t("clients.name")}</th>
                      <th>{t("clients.email")}</th>
                      <th>{t("clients.phone")}</th>
                      <th>{t("clients.address")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td className="font-medium text-slate-900">{client.name}</td>
                        <td className="text-slate-500">{client.email}</td>
                        <td className="text-slate-500">{client.phone}</td>
                        <td className="text-slate-500">{client.address}</td>
                        <td className="text-right">
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="btn btn-danger"
                            disabled={deletingId === client.id}
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
