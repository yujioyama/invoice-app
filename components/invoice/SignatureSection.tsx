interface SignatureSectionProps {
  createdAt: string;
}

export default function SignatureSection({ createdAt }: SignatureSectionProps) {
  return (
    <div className="mb-9">
      <h3 className="mb-3 text-lg tracking-wide font-now">
        AUTHORIZED SIGNATURE
      </h3>
      <div className="mb-5 text-[26px] font-eyesome-script">Yuji Oyama</div>
      <p className="text-sm font-tt-chocolates">
        Date:{" "}
        {new Date(createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
