import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatMonthLabel(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(new Date(Number(year), Number(month) - 1, 1));
}

export function sentenceCase(value) {
  return value
    ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    : "";
}
