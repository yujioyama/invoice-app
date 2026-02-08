import { BankAccount } from "@/shared/types/BankAccount";

type PaymentInformationProps = {
  bankAccount: BankAccount;
};

export default function PaymentInformation({
  bankAccount,
}: PaymentInformationProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-base tracking-wide font-now">
        PAYMENT INFORMATION:
      </h3>
      <div className="text-sm font-tt-chocolates space-y-0.5">
        <div className="grid grid-cols-[140px_1fr]">
          <span>Bank:</span>
          <span>{bankAccount.bank}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Account Name:</span>
          <span>{bankAccount.accountName}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Branch Code:</span>
          <span>{bankAccount.branchCode}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>Account Number:</span>
          <span>{bankAccount.accountNumber}</span>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <span>SWIFT/BIC:</span>
          <span>{bankAccount.swiftBic}</span>
        </div>
        {bankAccount.branchAddress && (
          <div className="grid grid-cols-[140px_1fr]">
            <span>Branch / Address:</span>
            <span>{bankAccount.branchAddress}</span>
          </div>
        )}
        <div className="grid grid-cols-[140px_1fr]">
          <span>Currency:</span>
          <span>{bankAccount.currency}</span>
        </div>
        {bankAccount.intermediaryBank && (
          <div className="grid grid-cols-[140px_1fr]">
            <span>Intermediary Bank:</span>
            <span>{bankAccount.intermediaryBank}</span>
          </div>
        )}
      </div>
    </div>
  );
}
