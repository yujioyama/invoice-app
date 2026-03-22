import type { BankAccount } from "./BankAccount";

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  countryCode?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bankAccounts?: BankAccount[];
}
