export default function PaymentInformation() {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-base tracking-wide font-now">
        PAYMENT INFORMATION:
      </h3>
      <div className="text-sm font-tt-chocolates space-y-0.5">
        <div className="grid grid-cols-[140px_1fr]">
          <span>Bank:</span>
          <span>SBI SUMISHIN NET BANK, LTD. Tokyo</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Account Name:</span>
          <span>Oyama Yuji</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Branch Code:</span>
          <span>107</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Account Number:</span>
          <span>9191871</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>SWIFT/BIC:</span>
          <span>NTSSJPJT</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Branch / Address:</span>
          <span>
            107 / Sumitomo Fudosan Roppongi Grand Tower, 2-1, Roppongi 3-chome,
            Minato-ku, Tokyo, Japan
          </span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Currency:</span>
          <span>AUD</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Intermediary Bank:</span>
          <span>UBS SWITZERLAND AG (SWIFT/BIC: UBSWCHZH80A)</span>
        </div>
      </div>
    </div>
  );
}
