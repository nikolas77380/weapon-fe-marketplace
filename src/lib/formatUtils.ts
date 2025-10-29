/**
 * Formats a number with commas as thousand separators
 * @param num - The number to format
 * @returns Formatted number string with commas
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString("en-US");
};

/**
 * Formats a price with commas and currency symbol
 * @param price - The price to format
 * @param currency - The currency symbol (default: '$')
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = "$"): string => {
  return `${formatNumberWithCommas(price)}${currency}`;
};

/**
 * Gets the price for the selected currency from product prices
 * @param product - Product object with priceUSD, priceEUR, priceUAH
 * @param selectedCurrency - Currency to display
 * @returns Formatted price in selected currency
 */
export const getDisplayPrice = (
  product: {
    priceUSD?: number;
    priceEUR?: number;
    priceUAH?: number;
    price?: number;
    currency?: string;
  },
  selectedCurrency: string
): string => {
  const getCurrencySymbol = (currency: string): string => {
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

  // Get price for selected currency
  let price: number = 0;

  if (selectedCurrency === "USD") {
    price = product.priceUSD ?? 0;
  } else if (selectedCurrency === "EUR") {
    price = product.priceEUR ?? 0;
  } else if (selectedCurrency === "UAH") {
    price = product.priceUAH ?? 0;
  } else {
    // Fallback to legacy price/currency
    price = product.price ?? 0;
  }

  // If price is 0, try to fallback to legacy price
  if (price === 0 && product.price) {
    price = product.price;
  }

  const symbol = getCurrencySymbol(selectedCurrency);
  return formatPrice(price, symbol);
};
