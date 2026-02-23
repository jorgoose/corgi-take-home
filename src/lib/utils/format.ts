export function formatPercent(value: number, decimals: number = 2): string {
  // Fix negative zero: -0.001 rounds to "-0.00" with toFixed
  const rounded = Number(value.toFixed(decimals));
  if (rounded === 0) return `0.${"0".repeat(decimals)}%`;
  return `${value.toFixed(decimals)}%`;
}

/** Like formatPercent but with explicit "+" prefix for positive values (for scenario/return contexts) */
export function formatPercentSigned(value: number, decimals: number = 2): string {
  const rounded = Number(value.toFixed(decimals));
  if (rounded === 0) return `0.${"0".repeat(decimals)}%`;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatPercentUnsigned(value: number, decimals: number = 2): string {
  const rounded = Number(value.toFixed(decimals));
  if (rounded === 0) return `0.${"0".repeat(decimals)}%`;
  return `${Math.abs(value).toFixed(decimals)}%`;
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return `$${value.toFixed(decimals)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDaysRemaining(days: number): string {
  return `${days} day${days !== 1 ? "s" : ""}`;
}
