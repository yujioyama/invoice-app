import { forwardRef } from "react";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceInfo from "./InvoiceInfo";
import TasksTable from "./TasksTable";
import TotalSection from "./TotalSection";
import PaymentInformation from "./PaymentInformation";
import SignatureSection from "./SignatureSection";
import InvoiceFooter from "./InvoiceFooter";
import { Client } from "@/shared/types/Client";
import { BankAccount } from "@/shared/types/BankAccount";
import { User } from "@/shared/types/User";
import type { Currency, Task } from "@/shared/types/Invoice";

interface InvoiceDocumentProps {
  invoiceName: string;
  createdAt: string;
  tasks: Task[];
  grandTotal: number;
  currency: Currency;
  client: Client | null;
  bankAccount: BankAccount | null;
  user: User | null;
}

const InvoiceDocument = forwardRef<HTMLDivElement, InvoiceDocumentProps>(
  (
    {
      invoiceName,
      createdAt,
      tasks,
      grandTotal,
      currency,
      client,
      bankAccount,
      user,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        id="invoice-pdf"
        className="bg-white max-w-[210mm] mx-auto shadow-lg font-now text-[#000000]"
      >
        <InvoiceHeader />

        <div className="invoice-body px-20 pb-6 pt-7">
          <InvoiceInfo
            invoiceName={invoiceName}
            createdAt={createdAt}
            client={client}
          />
          <TasksTable tasks={tasks} currency={currency} />
          <TotalSection total={grandTotal} currency={currency} />
          {bankAccount && <PaymentInformation bankAccount={bankAccount} />}
          <SignatureSection
            createdAt={createdAt}
            firstName={user?.firstName || ""}
            lastName={user?.lastName || ""}
          />
        </div>

        <InvoiceFooter user={user} />
      </div>
    );
  },
);

InvoiceDocument.displayName = "InvoiceDocument";

export default InvoiceDocument;
