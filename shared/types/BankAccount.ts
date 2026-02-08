export type BankAccount = {
  id: string;
  userId: string;
  bank: string;
  accountName: string;
  branchCode: string;
  accountNumber: string;
  swiftBic: string;
  branchAddress?: string;
  currency: string;
  intermediaryBank?: string;
  createdAt: string;
  updatedAt: string;
};
