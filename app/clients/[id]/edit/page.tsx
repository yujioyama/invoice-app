"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { getClientById, updateClient } from "@/lib/apiClients";
import { useTranslation } from "react-i18next";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import toast from "react-hot-toast";

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const resolvedParams = use(params);

  const [client, setClient] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);

  const { run: saveClient, loading: saving } = useAsyncAction(
    (data: typeof client) => updateClient(resolvedParams.id, data),
  );

  useEffect(() => {
    async function fetchClient() {
      try {
        const data = await getClientById(resolvedParams.id);
        if (!data) {
          toast.error(t("clients.loadFailed"));
          router.push("/clients");
          return;
        }
        setClient({
          name: data.name,
          email: data.email ?? "",
          address: data.address,
          phone: data.phone ?? "",
          country: data.country,
        });
      } catch {
        toast.error(t("clients.loadFailed"));
        router.push("/clients");
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [resolvedParams.id, router, t]);

  const isValid = useMemo(() => {
    return client.name.trim() !== "" && client.address.trim() !== "";
  }, [client]);

  const handleSave = async () => {
    try {
      await saveClient(client);
      toast.success(t("clients.updated"));
      router.push("/clients");
    } catch {
      toast.error(t("clients.updateFailed"));
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="mx-auto w-full max-w-2xl">
          <p className="text-slate-700">{t("clients.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-2xl">
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t("clients.editTitle")}</h1>
            <p className="subtitle">{t("clients.subtitle")}</p>
          </div>

          <div className="card-body">
            {/* Name */}
            <div className="mb-6">
              <label className="label">{t("clients.name")}</label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                placeholder={t("clients.namePlaceholder")}
                className="input"
              />
            </div>
            {/* Address */}
            <div className="mb-6">
              <label className="label">{t("clients.address")}</label>
              <input
                type="text"
                value={client.address}
                onChange={(e) =>
                  setClient({ ...client, address: e.target.value })
                }
                placeholder={t("clients.addressPlaceholder")}
                className="input"
              />
            </div>
            {/* Country */}
            <div className="mb-6">
              <label className="label">{t("clients.country")}</label>
              <input
                type="text"
                value={client.country}
                onChange={(e) =>
                  setClient({ ...client, country: e.target.value })
                }
                placeholder={t("clients.countryPlaceholder")}
                className="input"
              />
            </div>
            {/* Email */}
            <div className="mb-6">
              <label className="label">{t("clients.email")}</label>
              <input
                type="email"
                value={client.email}
                onChange={(e) =>
                  setClient({ ...client, email: e.target.value })
                }
                placeholder={t("clients.emailPlaceholder")}
                className="input"
              />
            </div>
            {/* Phone */}
            <div className="mb-6">
              <label className="label">{t("clients.phone")}</label>
              <input
                type="text"
                value={client.phone}
                onChange={(e) =>
                  setClient({ ...client, phone: e.target.value })
                }
                placeholder={t("clients.phonePlaceholder")}
                className="input"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-9">
              <button
                onClick={handleSave}
                disabled={!isValid || saving}
                className="btn btn-primary"
              >
                {saving ? t("clients.saving") : t("clients.saveChanges")}
              </button>
              <button
                onClick={() => router.push("/clients")}
                className="btn btn-ghost"
              >
                {t("clients.list")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
