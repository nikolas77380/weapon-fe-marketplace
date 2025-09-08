"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

interface PriceRangeProps {
  onPriceChange?: (min: number, max: number) => void;
  initialMin?: number;
  initialMax?: number;
  minLimit?: number;
  maxLimit?: number;
}

const PriceRange = ({
  onPriceChange,
  initialMin = 1,
  initialMax = 500000,
  minLimit = 1,
  maxLimit = 500000,
}: PriceRangeProps) => {
  // Price range state
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);

  // Initial values
  useEffect(() => {
    onPriceChange?.(initialMin, initialMax);
  }, []);

  // Sync with external prop changes (for Clear All functionality)
  useEffect(() => {
    setMinPrice(initialMin);
    setMaxPrice(initialMax);
  }, [initialMin, initialMax]);

  // Calculate percentages for slider positioning (we limit within the limits)
  const clampedMinPrice = useMemo(
    () => Math.max(minLimit, Math.min(minPrice, maxLimit)),
    [minPrice, minLimit, maxLimit]
  );

  const clampedMaxPrice = useMemo(
    () => Math.max(minLimit, Math.min(maxPrice, maxLimit)),
    [maxPrice, minLimit, maxLimit]
  );

  const minPercent = useMemo(
    () => ((clampedMinPrice - minLimit) / (maxLimit - minLimit)) * 100,
    [clampedMinPrice, minLimit, maxLimit]
  );

  const maxPercent = useMemo(
    () => ((clampedMaxPrice - minLimit) / (maxLimit - minLimit)) * 100,
    [clampedMaxPrice, minLimit, maxLimit]
  );

  // Handle range slider changes
  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Number(e.target.value), maxPrice - 100);
      setMinPrice(value);
      onPriceChange?.(value, maxPrice);
    },
    [maxPrice, onPriceChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(Number(e.target.value), minPrice + 100);
      setMaxPrice(value);
      onPriceChange?.(minPrice, value);
    },
    [minPrice, onPriceChange]
  );

  // Handle input changes
  const handleMinInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue === "") {
        setMinPrice(0);
        return;
      }

      const numValue = Number(inputValue);
      // Validation input on focus from field
      if (!isNaN(numValue)) {
        setMinPrice(numValue);
      }
    },
    []
  );

  const handleMaxInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue === "") {
        setMaxPrice(0);
        return;
      }

      const numValue = Number(inputValue);
      // Validation on focus from field
      if (!isNaN(numValue)) {
        setMaxPrice(numValue);
      }
    },
    []
  );

  // Validation on loss of focus
  const handleMinBlur = useCallback(() => {
    let finalValue = minPrice;

    if (minPrice < minLimit) {
      finalValue = minLimit;
    } else if (minPrice >= maxPrice) {
      finalValue = maxPrice - 100;
    }

    setMinPrice(finalValue);
    onPriceChange?.(finalValue, maxPrice);
  }, [minPrice, minLimit, maxPrice, onPriceChange]);

  const handleMaxBlur = useCallback(() => {
    let finalValue = maxPrice;

    if (maxPrice > maxLimit) {
      finalValue = maxLimit;
    } else if (maxPrice <= minPrice) {
      finalValue = minPrice + 100;
    }

    setMaxPrice(finalValue);
    onPriceChange?.(minPrice, finalValue);
  }, [maxPrice, maxLimit, minPrice, onPriceChange]);

  return (
    <div>
      <h2 className="text-sm font-medium font-roboto">Price range</h2>
      <div className="mt-3 w-[240px]">
        <div className="flex flex-col gap-4">
          {/* Range Slider */}
          <div className="relative h-4">
            {/* Track */}
            <div className="absolute top-1/2 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2"></div>

            {/* Active Range */}
            <div
              className="absolute top-1/2 h-1 bg-gold-main rounded-full transform -translate-y-1/2"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            ></div>

            {/* Min Range Input */}
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              value={clampedMinPrice}
              onChange={handleMinChange}
              style={{
                zIndex: clampedMinPrice > clampedMaxPrice - 200 ? 2 : 1,
              }}
              className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold-main [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-75"
            />

            {/* Max Range Input */}
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              value={clampedMaxPrice}
              onChange={handleMaxChange}
              style={{
                zIndex: clampedMaxPrice < clampedMinPrice + 200 ? 2 : 1,
              }}
              className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold-main [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-75"
            />
          </div>

          {/* Min/Max Inputs */}
          <div className="flex justify-between gap-3">
            <div className="relative">
              <span className="absolute left-6 top-0 px-1 bg-white transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                Min
              </span>
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <input
                type="number"
                value={minPrice === 0 ? "" : minPrice}
                onChange={handleMinInputChange}
                onBlur={handleMinBlur}
                className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
            <div className="relative">
              <span className="absolute left-6 top-0 px-1 bg-white transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                Max
              </span>
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <input
                type="number"
                value={maxPrice === 0 ? "" : maxPrice}
                onChange={handleMaxInputChange}
                onBlur={handleMaxBlur}
                className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
