"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/apiClients";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

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

  // react-hook-form の初期化
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>();

  const { user } = useAuth();

  // react-hook-form collects form data and calls onSubmit when the form is submitted
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

          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            {/* Name */}
            <div className="mb-6">
              <label className="label">{t("clients.name")}</label>
              <input
                {...register("name", { required: "名前は必須です" })}
                type="text"
                placeholder={t("clients.namePlaceholder")}
                className="input"
              />
              {/* インラインエラー表示 */}
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
                {...register("address", { required: "住所は必須です" })}
                type="text"
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
                {...register("country")}
                type="text"
                placeholder={t("clients.countryPlaceholder")}
                className="input"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="label">{t("clients.email")}</label>
              <input
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "正しいメールアドレスを入力してください",
                  },
                })}
                type="email"
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
                {...register("phone")}
                type="text"
                placeholder={t("clients.phonePlaceholder")}
                className="input"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-9">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? t("clients.saving") : t("clients.saveContinue")}
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
