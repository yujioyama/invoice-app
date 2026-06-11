"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getClientById, updateClient } from "@/lib/apiClients";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FormField from "@/components/ui/FormField";
import FormActions from "@/components/ui/FormActions";

type ClientFormData = {
  name: string;
  address: string;
  country: string;
  email: string;
  phone: string;
};

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const resolvedParams = use(params);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        const data = await getClientById(resolvedParams.id);
        if (!data) {
          toast.error(t("clients.loadFailed"));
          router.push("/clients");
          return;
        }
        reset(data);
      } catch {
        toast.error(t("clients.loadFailed"));
        router.push("/clients");
      } finally {
        setSaving(false);
      }
    }
    fetchClient();
  }, [resolvedParams.id, router, t, reset]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      setSaving(true);
      await updateClient(resolvedParams.id, data);
      router.push("/clients");
    } catch (error) {
      console.error("Failed to save client:", error);
      toast.error(t("clients.saveFailedWithBackend"));
    } finally {
      setSaving(false);
    }
  };

  if (saving) {
    return (
      <div className="page">
        <div className="mx-auto w-full max-w-2xl">
          <p className="text-slate-700">{t("clients.saving")}</p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-6">
            <FormField
              label={t("clients.name")}
              type="text"
              {...register("name", { required: "名前は必須です" })}
              placeholder={t("clients.namePlaceholder")}
              error={errors.name?.message}
            />
            <FormField
              label={t("clients.address")}
              type="text"
              {...register("address", { required: "住所は必須です" })}
              placeholder={t("clients.addressPlaceholder")}
              error={errors.address?.message}
            />
            <FormField
              label={t("clients.country")}
              type="text"
              {...register("country")}
              placeholder={t("clients.countryPlaceholder")}
            />
            <FormField
              label={t("clients.email")}
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "正しいメールアドレスを入力してください",
                },
              })}
              placeholder={t("clients.emailPlaceholder")}
              error={errors.email?.message}
            />
            <FormField
              label={t("clients.phone")}
              type="text"
              {...register("phone")}
              placeholder={t("clients.phonePlaceholder")}
              error={errors.phone?.message}
            />
            <FormActions
              primaryLabel={saving ? t("clients.saving") : t("clients.saveChanges")}
              primaryDisabled={saving}
              secondaryLabel={t("clients.list")}
              onSecondary={() => router.push("/clients")}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
