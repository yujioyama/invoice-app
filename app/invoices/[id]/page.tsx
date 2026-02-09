"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getInvoiceById } from "@/lib/apiInvoices";
import { getClientById } from "@/lib/apiClients";
import type { Invoice } from "@/lib/apiInvoices";
import type { Client } from "@/lib/apiClients";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import { BankAccount } from "@/shared/types/BankAccount";
import { getMyDetails } from "@/lib/apiAuth";
import type { User } from "@/shared/types/User";
import { useTranslation } from "react-i18next";

interface Task {
  name: string;
  rate: number;
  hours: number;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useTranslation();
  const resolvedParams = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadInvoice() {
      setLoading(true);
      try {
        const [invoiceData, userRes] = await Promise.all([
          getInvoiceById(resolvedParams.id),
          getMyDetails(),
        ]);

        setInvoice(invoiceData);
        // bankAccountはuserRes.user.bankAccountsの1件目を利用
        const firstBankAccount = userRes?.user?.bankAccounts?.[0] ?? null;
        setBankAccount(firstBankAccount);
        setUser(userRes?.user || null);

        if (invoiceData?.clientId) {
          const clientData = await getClientById(invoiceData.clientId);
          setClient(clientData);
        } else {
          setClient(null);
        }
      } catch (error) {
        console.error("Failed to load invoice:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [resolvedParams.id]);

  const downloadPDF = async () => {
    if (!invoice) return;
    try {
      const res = await fetch(`/api/invoices/${resolvedParams.id}/pdf`);
      if (!res.ok) throw new Error("PDF download failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${invoice.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      alert(t("invoiceDetail.downloadFailed"));
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p className="text-slate-700">{t("invoiceDetail.loading")}</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h1 className="title">{t("invoiceDetail.notFoundTitle")}</h1>
              <p className="subtitle">{t("invoiceDetail.notFoundSubtitle")}</p>
            </div>
            <div className="card-body">
              <button
                onClick={() => router.push("/invoices/new")}
                className="btn btn-primary"
              >
                {t("invoiceDetail.createNew")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tasks: Task[] = invoice.tasks as Task[];
  const grandTotal = tasks.reduce((sum, t) => sum + t.rate * t.hours, 0);

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-[210mm]">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/invoices/${resolvedParams.id}/edit`)}
            className="btn btn-secondary"
          >
            {t("invoiceDetail.edit")}
          </button>
          <button onClick={downloadPDF} className="btn btn-primary">
            {t("invoiceDetail.download")}
          </button>
          <button
            onClick={() => router.push("/invoices")}
            className="btn btn-ghost"
          >
            {t("invoices.list")}
          </button>
        </div>
      </div>

      <InvoiceDocument
        ref={invoiceRef}
        invoiceName={invoice.name}
        createdAt={invoice.createdAt}
        tasks={tasks}
        grandTotal={grandTotal}
        client={client}
        user={user}
        bankAccount={bankAccount}
      />
    </div>
  );
}
