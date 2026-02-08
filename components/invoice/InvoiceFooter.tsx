import { User } from "@/shared/types/User";

interface InvoiceFooterProps {
  user: User | null;
}

export default function InvoiceFooter({ user }: InvoiceFooterProps) {
  const phoneDisplay = [user?.countryCode, user?.phone]
    .filter(Boolean)
    .join(" ");

  const addressDisplay = [user?.street, user?.city, user?.state]
    .filter(Boolean)
    .join(", ");

  const postalCountryDisplay = [user?.postalCode, user?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="invoice-footer flex justify-between px-20 pt-6 pb-6 bg-[#f6f5f4]">
      <div className="font-now">
        {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
      </div>
      <div className="text-right font-tt-chocolates">
        <p>{phoneDisplay}</p>
        <p>{user?.email}</p>
        <p>{addressDisplay}</p>
        <p>{postalCountryDisplay}</p>
      </div>
    </div>
  );
}
