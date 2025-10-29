"use client";

import useLocalStorage from "./useLocalStorage";

export type Currency = "USD" | "EUR" | "UAH";

// Exchange rates (you can make these dynamic with an API)
const EXCHANGE_RATES: Record<Currency, Record<Currency, number>> = {
  USD: { USD: 1, EUR: 0.91, UAH: 36.5 },
  EUR: { USD: 1.1, EUR: 1, UAH: 40.15 },
  UAH: { USD: 0.0274, EUR: 0.0249, UAH: 1 },
};

/**
 * Hook to manage selected currency in localStorage
 */
export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency, removeCurrency] =
    useLocalStorage<Currency>("selectedCurrency", "USD");

  return {
    selectedCurrency,
    setSelectedCurrency,
    removeCurrency,
  };
};

/**
 * Convert price from one currency to another
 * @param amount - The amount to convert
 * @param from - Source currency
 * @param to - Target currency
 * @returns Converted amount
 */
export const convertCurrency = (
  amount: number,
  from: Currency,
  to: Currency
): number => {
  if (from === to) return amount;

  const rate = EXCHANGE_RATES[from][to];
  return amount * rate;
};

/**
 * Get currency symbol for display
 */
export const getCurrencySymbol = (currency: Currency): string => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "UAH":
      return "₴";
    default:
      return "$";
  }
};

/**
 * Format price with currency symbol
 */
export const formatPriceWithCurrency = (
  price: number,
  currency: Currency = "USD"
): string => {
  const symbol = getCurrencySymbol(currency);
  return `${price.toLocaleString("en-US")}${symbol}`;
};
