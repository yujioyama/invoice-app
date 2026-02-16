"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient, Client } from "@/lib/apiClients";
import { getMe } from "@/lib/apiAuth";
import { useTranslation } from "react-i18next";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export default function NewInvoicePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [client, setClient] = useState<Client>({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    country: "",
  });
  const [user, setUser] = useState<{ id?: string }>({});

  const { run: saveClient, loading: saving } = useAsyncAction(createClient);

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
    try {
      if (!user.id) throw new Error(t("invoicePreview.userSessionNotFound"));
      console.log("Fetched user data:", user);
      await saveClient({
        userId: user.id,
        ...client,
      });

      router.push(`/clients`);
    } catch (error) {
      console.error("Failed to save client:", error);
      alert(t("clients.saveFailedWithBackend"));
    }
  };

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-2xl">
        <div className="card">
          <div className="card-header">
            <h1 className="title">{t("clients.create")}</h1>
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
                type="text"
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
                {saving ? t("clients.saving") : t("clients.saveContinue")}
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
