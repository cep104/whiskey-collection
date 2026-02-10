import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getQuantityPercentage(
  current: number | null,
  total: number
): number {
  if (!current) return 100;
  return Math.round((current / total) * 100);
}

export function getQuantityColor(percentage: number): string {
  if (percentage > 66) return "text-green-400";
  if (percentage > 33) return "text-yellow-400";
  return "text-red-400";
}
