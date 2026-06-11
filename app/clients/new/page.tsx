"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/apiClients";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import FormField from "@/components/ui/FormField";
import FormActions from "@/components/ui/FormActions";

type ClientFormData = {
  name: string;
  address: string;
  country: string;
  email: string;
  phone: string;
};

export default function NewClientPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>();

  const { user } = useAuth();

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (!user.id) throw new Error(t("invoicePreview.userSessionNotFound"));
      setSaving(true);
      await createClient({ userId: user.id, ...data });
      router.push("/clients");
    } catch (error) {
      console.error("Failed to save client:", error);
      toast.error(t("clients.saveFailedWithBackend"));
    } finally {
      setSaving(false);
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

          <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-6">
            <FormField
              label={t("clients.name")}
              {...register("name", { required: "名前は必須です" })}
              type="text"
              placeholder={t("clients.namePlaceholder")}
              error={errors.name?.message}
            />
            <FormField
              label={t("clients.address")}
              {...register("address", { required: "住所は必須です" })}
              type="text"
              placeholder={t("clients.addressPlaceholder")}
              error={errors.address?.message}
            />
            <FormField
              label={t("clients.country")}
              {...register("country")}
              type="text"
              placeholder={t("clients.countryPlaceholder")}
            />
            <FormField
              label={t("clients.email")}
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "正しいメールアドレスを入力してください",
                },
              })}
              type="email"
              placeholder={t("clients.emailPlaceholder")}
              error={errors.email?.message}
            />
            <FormField
              label={t("clients.phone")}
              {...register("phone")}
              type="text"
              placeholder={t("clients.phonePlaceholder")}
            />
            <FormActions
              primaryLabel={saving ? t("clients.saving") : t("clients.saveContinue")}
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
