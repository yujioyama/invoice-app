interface InvoiceInfoProps {
  invoiceName: string;
  createdAt: string;
}

export default function InvoiceInfo({
  invoiceName,
  createdAt,
}: InvoiceInfoProps) {
  return (
    <div className="flex justify-between mb-8">
      <div>
        <h2 className="mb-3 text-lg tracking-wide font-now">BILLED TO:</h2>
        <p className="text-sm tracking-wider font-tt-chocolates">
          Sushi Factory (Australia) Pty Ltd
          <br />
          1A Lenton Place North Rocks NSW 2151
          <br />
          Australia
        </p>
      </div>
      <div className="text-right">
        <p className="mb-4 text-lg tracking-wide font-now">
          INVOICE: {invoiceName}
        </p>
        <p className="text-sm tracking-wider font-tt-chocolates">
          {createdAt &&
            new Date(createdAt)
              .toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              .replace(/(\w+)\s(\d+)/, "$1, $2")}
        </p>
      </div>
    </div>
  );
}
