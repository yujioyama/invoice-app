interface TotalSectionProps {
  total: number;
}

export default function TotalSection({ total }: TotalSectionProps) {
  return (
    <div className="mb-8">
      <p className="text-base font-bold font-now text-black">
        TOTAL DUE(AUD) <span className="float-right">${total.toFixed(2)}</span>
      </p>
    </div>
  );
}
