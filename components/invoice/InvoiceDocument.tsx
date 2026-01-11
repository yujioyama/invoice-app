import { forwardRef } from "react";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceInfo from "./InvoiceInfo";
import TasksTable from "./TasksTable";
import TotalSection from "./TotalSection";
import PaymentInformation from "./PaymentInformation";
import SignatureSection from "./SignatureSection";
import InvoiceFooter from "./InvoiceFooter";

interface Task {
  name: string;
  rate: number;
  hours: number;
}

interface InvoiceDocumentProps {
  invoiceName: string;
  createdAt: string;
  tasks: Task[];
  grandTotal: number;
}

const InvoiceDocument = forwardRef<HTMLDivElement, InvoiceDocumentProps>(
  ({ invoiceName, createdAt, tasks, grandTotal }, ref) => {
    return (
      <div
        ref={ref}
        id="invoice-pdf"
        className="bg-white max-w-[210mm] mx-auto shadow-lg font-sans text-[#000000]"
      >
        <InvoiceHeader />

        <div className="invoice-body px-20 pb-6 pt-7">
          <InvoiceInfo invoiceName={invoiceName} createdAt={createdAt} />
          <TasksTable tasks={tasks} />
          <TotalSection total={grandTotal} />
          <PaymentInformation />
          <SignatureSection createdAt={createdAt} />
        </div>

        <InvoiceFooter />
      </div>
    );
  }
);

InvoiceDocument.displayName = "InvoiceDocument";

export default InvoiceDocument;
