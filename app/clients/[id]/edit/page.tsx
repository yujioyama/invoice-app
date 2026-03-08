"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getClientById, updateClient } from "@/lib/apiClients";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            {/* Name */}
            <div className="mb-6">
              <label className="label">{t("clients.name")}</label>
              <input
                type="text"
                {...register("name", { required: "名前は必須です" })}
                placeholder={t("clients.namePlaceholder")}
                className="input"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="label">{t("clients.address")}</label>
              <input
                type="text"
                {...register("address", { required: "住所は必須です" })}
                placeholder={t("clients.addressPlaceholder")}
                className="input"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="mb-6">
              <label className="label">{t("clients.country")}</label>
              <input
                type="text"
                {...register("country")}
                placeholder={t("clients.countryPlaceholder")}
                className="input"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="label">{t("clients.email")}</label>
              <input
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "正しいメールアドレスを入力してください",
                  },
                })}
                placeholder={t("clients.emailPlaceholder")}
                className="input"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="label">{t("clients.phone")}</label>
              <input
                type="text"
                {...register("phone")}
                placeholder={t("clients.phonePlaceholder")}
                className="input"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-9">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? t("clients.saving") : t("clients.saveChanges")}
              </button>
              <button
                type="button"
                onClick={() => router.push("/clients")}
                className="btn btn-ghost"
              >
                {t("clients.list")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
