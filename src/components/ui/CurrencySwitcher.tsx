"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DollarSign, Euro } from "lucide-react";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
];

const getCurrencyConfig = (currency: string) => {
  return currencies.find((curr) => curr.code === currency);
};

interface CurrencySwitcherProps {
  classNameMainDiv?: string;
  classNameSelectTrigger?: string;
  classNameSelectValue?: string;
}

export default function CurrencySwitcher({
  classNameMainDiv,
  classNameSelectTrigger,
  classNameSelectValue,
}: CurrencySwitcherProps) {
  const [currentCurrency, setCurrentCurrency] = useState("USD");

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(savedCurrency);
        if (currencies.some((curr) => curr.code === parsed)) {
          setCurrentCurrency(parsed);
        }
      } catch {
        // If not JSON, treat as plain string (backward compatibility)
        if (currencies.some((curr) => curr.code === savedCurrency)) {
          setCurrentCurrency(savedCurrency);
          // Normalize to JSON format
          localStorage.setItem(
            "selectedCurrency",
            JSON.stringify(savedCurrency)
          );
        }
      }
    }
  }, []);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrentCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", JSON.stringify(newCurrency));
    // Trigger custom event to notify all components
    window.dispatchEvent(new Event("currencyChanged"));
  };

  const getCurrentCurrencyConfig = () => {
    return getCurrencyConfig(currentCurrency);
  };

  return (
    <div className={cn("flex items-center", classNameMainDiv)}>
      {/* Dynamic currency icon/symbol */}
      {getCurrentCurrencyConfig()?.code === "USD" ? (
        <DollarSign className="h-4 w-4 text-gold-main" />
      ) : getCurrentCurrencyConfig()?.code === "EUR" ? (
        <Euro className="h-4 w-4 text-gold-main" />
      ) : (
        <span className="h-4 w-4 inline-flex items-center justify-center text-gold-main text-base leading-none">
          {getCurrentCurrencyConfig()?.symbol}
        </span>
      )}
      <Select value={currentCurrency} onValueChange={handleCurrencyChange}>
        <SelectTrigger
          size="sm"
          className={cn(
            "w-20 border-none !h-7 bg-transparent transition-colors",
            classNameSelectTrigger
          )}
        >
          <SelectValue>
            <span className={cn("text-sm font-medium", classNameSelectValue)}>
              {getCurrentCurrencyConfig()?.code}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="mt-2 border-gold-main">
          {currencies.map((currency) => (
            <SelectItem
              key={currency.code}
              value={currency.code}
              className="cursor-pointer hover:bg-accent text-gold-main hover:text-gold-main/70"
            >
              <span className="text-sm font-medium">
                {currency.code} ({currency.symbol})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
