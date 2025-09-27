import { toPersianDigits } from "./numberFormatter";

export function formatPrice(price) {
  if (typeof price !== "number") return "";
  const formatted = new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 0,
  }).format(price);

  return toPersianDigits(formatted) + " تومان";
}
