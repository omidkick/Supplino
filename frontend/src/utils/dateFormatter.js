import { toPersianDigits } from "./numberFormatter";

export function toLocalDateShort(date) {
  return new Date(date).toLocaleDateString("fa-IR", {});
}

export function formatDate(dateString) {
  const date = new Date(dateString).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return toPersianDigits(date);
}

// In your dateFormatter.js
export const toLocalTimeShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
