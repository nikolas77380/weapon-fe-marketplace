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
