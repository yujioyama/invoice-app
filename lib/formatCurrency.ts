import type { Currency } from "@/shared/types/Invoice";

export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: string,
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(safeAmount);
}
