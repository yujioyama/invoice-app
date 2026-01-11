import { Suspense } from "react";
import PreviewInvoiceClient from "./PreviewInvoiceClient";

export default function PreviewInvoicePage() {
  return (
    <Suspense>
      <PreviewInvoiceClient />
    </Suspense>
  );
}
