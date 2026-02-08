export class RegisterDto {
  email: string;
  name: string;
  password: string;
  // Address fields
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  // Bank account fields
  bank?: string;
  accountName?: string;
  branchCode?: string;
  accountNumber?: string;
  swiftBic?: string;
  branchAddress?: string;
  currency?: string;
  intermediaryBank?: string;
}
