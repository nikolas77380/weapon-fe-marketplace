// "use client";

// import { useTranslations } from "next-intl";
// import React, { useState, useEffect, useMemo, useCallback } from "react";

// interface PriceRangeProps {
//   onPriceChange?: (min: number, max: number) => void;
//   initialMin?: number;
//   initialMax?: number;
//   minLimit?: number;
//   maxLimit?: number;
//   isMobile?: boolean;
// }

// const PriceRange = ({
//   onPriceChange,
//   initialMin = 0,
//   initialMax = 1000,
//   minLimit = 0,
//   maxLimit = 1000,
//   isMobile = false,
// }: PriceRangeProps) => {
//   const t = useTranslations("PriceRange");

//   const safeInitialMin = initialMin ?? 0;
//   const safeInitialMax = initialMax ?? 1000;

//   // Price range state
//   const [minPrice, setMinPrice] = useState(safeInitialMin);
//   const [maxPrice, setMaxPrice] = useState(safeInitialMax);

//   // Sync with external prop changes (for Clear All functionality)
//   useEffect(() => {
//     setMinPrice(safeInitialMin);
//     setMaxPrice(safeInitialMax);
//   }, [safeInitialMin, safeInitialMax]);

//   // Calculate percentages for slider positioning (we limit within the limits)
//   const clampedMinPrice = useMemo(
//     () => Math.max(minLimit, Math.min(minPrice, maxLimit)),
//     [minPrice, minLimit, maxLimit]
//   );

//   const clampedMaxPrice = useMemo(
//     () => Math.max(minLimit, Math.min(maxPrice, maxLimit)),
//     [maxPrice, minLimit, maxLimit]
//   );

//   const minPercent = useMemo(
//     () => ((clampedMinPrice - minLimit) / (maxLimit - minLimit)) * 100,
//     [clampedMinPrice, minLimit, maxLimit]
//   );

//   const maxPercent = useMemo(
//     () => ((clampedMaxPrice - minLimit) / (maxLimit - minLimit)) * 100,
//     [clampedMaxPrice, minLimit, maxLimit]
//   );

//   // Handle range slider changes
//   const handleMinChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = Math.min(Number(e.target.value), maxPrice - 100);
//       setMinPrice(value);
//     },
//     [maxPrice]
//   );

//   const handleMaxChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = Math.max(Number(e.target.value), minPrice + 100);
//       setMaxPrice(value);
//     },
//     [minPrice]
//   );

//   // Handle slider end events
//   const handleSliderEnd = useCallback(() => {
//     onPriceChange?.(minPrice, maxPrice);
//   }, [minPrice, maxPrice, onPriceChange]);

//   // Handle input changes
//   const handleMinInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const inputValue = e.target.value;

//       if (inputValue === "") {
//         setMinPrice(0);
//         return;
//       }

//       const numValue = Number(inputValue);
//       // Validation input on focus from field
//       if (!isNaN(numValue)) {
//         setMinPrice(numValue);
//       }
//     },
//     []
//   );

//   const handleMaxInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const inputValue = e.target.value;

//       if (inputValue === "") {
//         setMaxPrice(0);
//         return;
//       }

//       const numValue = Number(inputValue);
//       // Validation on focus from field
//       if (!isNaN(numValue)) {
//         setMaxPrice(numValue);
//       }
//     },
//     []
//   );

//   // Validation on loss of focus
//   const handleMinBlur = useCallback(() => {
//     let finalValue = minPrice;

//     if (minPrice < minLimit) {
//       finalValue = minLimit;
//     } else if (minPrice >= maxPrice) {
//       finalValue = maxPrice - 100;
//     }

//     setMinPrice(finalValue);
//     onPriceChange?.(finalValue, maxPrice);
//   }, [minPrice, minLimit, maxPrice, onPriceChange]);

//   const handleMaxBlur = useCallback(() => {
//     let finalValue = maxPrice;

//     if (maxPrice > maxLimit) {
//       finalValue = maxLimit;
//     } else if (maxPrice <= minPrice) {
//       finalValue = minPrice + 100;
//     }

//     setMaxPrice(finalValue);
//     onPriceChange?.(minPrice, finalValue);
//   }, [maxPrice, maxLimit, minPrice, onPriceChange]);

//   return (
//     <div>
//       <h2 className="text-sm font-medium font-roboto mb-3">{t("title")}</h2>
//       <div className={isMobile ? "w-full max-w-[280px]" : "w-[240px]"}>
//         <div className="flex flex-col gap-4">
//           {/* Range Slider */}
//           <div className="relative h-4">
//             {/* Track */}
//             <div className="absolute top-1/2 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2"></div>

//             {/* Active Range */}
//             <div
//               className="absolute top-1/2 h-1 bg-gold-main rounded-full transform -translate-y-1/2"
//               style={{
//                 left: `${minPercent}%`,
//                 width: `${maxPercent - minPercent}%`,
//               }}
//             ></div>

//             {/* Min Range Input */}
//             <input
//               type="range"
//               min={minLimit}
//               max={maxLimit}
//               value={clampedMinPrice}
//               onChange={handleMinChange}
//               onMouseUp={handleSliderEnd}
//               onTouchEnd={handleSliderEnd}
//               style={{
//                 zIndex: clampedMinPrice > clampedMaxPrice - 200 ? 2 : 1,
//               }}
//               className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-gold-main [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-75"
//             />

//             {/* Max Range Input */}
//             <input
//               type="range"
//               min={minLimit}
//               max={maxLimit}
//               value={clampedMaxPrice}
//               onChange={handleMaxChange}
//               onMouseUp={handleSliderEnd}
//               onTouchEnd={handleSliderEnd}
//               style={{
//                 zIndex: clampedMaxPrice < clampedMinPrice + 200 ? 2 : 1,
//               }}
//               className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-gold-main [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-75"
//             />
//           </div>

//           {/* Min/Max Inputs */}
//           <div className="flex justify-between gap-3">
//             <div className="relative">
//               <span className="absolute left-5 top-0 px-1 bg-background transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
//                 {t("titleMin")}
//               </span>
//               <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
//                 $
//               </span>
//               <input
//                 type="number"
//                 value={minPrice === 0 ? "" : minPrice}
//                 onChange={handleMinInputChange}
//                 onBlur={handleMinBlur}
//                 className="outline-none w-full pl-6 pr-2 py-2 border border-gray-300 rounded text-sm font-medium [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
//               />
//             </div>
//             <div className="relative">
//               <span className="absolute left-5 top-0 px-1 bg-background transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
//                 <p>{t("titleMax")}</p>
//               </span>
//               <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
//                 $
//               </span>
//               <input
//                 type="number"
//                 value={maxPrice === 0 ? "" : maxPrice}
//                 onChange={handleMaxInputChange}
//                 onBlur={handleMaxBlur}
//                 className="outline-none w-full pl-6 pr-2 py-2 border border-gray-300 rounded text-sm font-medium [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PriceRange;

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";

interface PriceRangeProps {
  minLimit: number;
  maxLimit: number;
  initialMin?: number;
  initialMax?: number;
  onPriceChange: (min: number, max: number) => void;
  isMobile?: boolean;
}

const PriceRange = ({
  minLimit,
  maxLimit,
  initialMin,
  initialMax,
  onPriceChange,
  isMobile = false,
}: PriceRangeProps) => {
  const t = useTranslations("PriceRange");

  // Безопасные значения по умолчанию
  const safeMinLimit = minLimit ?? 0;
  const safeMaxLimit = maxLimit ?? 100000;

  const [range, setRange] = useState<[number, number]>([
    initialMin ?? safeMinLimit,
    initialMax ?? safeMaxLimit,
  ]);

  // Отдельное состояние для инпутов (чтобы можно было вводить пустую строку)
  const [inputMin, setInputMin] = useState<string>(
    String(initialMin ?? safeMinLimit)
  );
  const [inputMax, setInputMax] = useState<string>(
    String(initialMax ?? safeMaxLimit)
  );

  const isUserInteracting = useRef(false);
  const isEditingInput = useRef(false);

  // Синхронизация при изменении initialMin/initialMax (когда родитель сбрасывает фильтры)
  useEffect(() => {
    if (
      !isUserInteracting.current &&
      initialMin !== undefined &&
      initialMax !== undefined
    ) {
      setRange([initialMin, initialMax]);
      setInputMin(String(initialMin));
      setInputMax(String(initialMax));
    }
  }, [initialMin, initialMax]);

  // Синхронизация инпутов с range при изменении слайдера (но не во время редактирования инпутов)
  useEffect(() => {
    if (!isEditingInput.current) {
      setInputMin(String(range[0]));
      setInputMax(String(range[1]));
    }
  }, [range]);

  // Обновляем локальное состояние во время перетаскивания
  const handleChange = (value: number[]) => {
    isUserInteracting.current = true;
    const [min, max] = value;
    setRange([min, max]);
    // Обновляем инпуты сразу при движении слайдера
    if (!isEditingInput.current) {
      setInputMin(String(min));
      setInputMax(String(max));
    }
  };

  // Обновляем родителя только когда пользователь отпустил слайдер
  const handleCommit = (value: number[]) => {
    const [min, max] = value;
    onPriceChange(min, max);
    // Даем время на обновление данных, затем разрешаем синхронизацию
    setTimeout(() => {
      isUserInteracting.current = false;
    }, 100);
  };

  // Не рендерим, пока не получили валидные данные
  if (!minLimit || !maxLimit || minLimit === maxLimit) {
    return null;
  }

  return (
    <div>
      <h2 className="text-sm font-medium font-roboto mb-3">{t("title")}</h2>
      <div className={isMobile ? "w-full max-w-[280px]" : "w-[240px]"}>
        <div className="flex flex-col gap-4">
          {/* Range Slider */}
          <div className="relative h-4">
            <Slider
              min={safeMinLimit}
              max={safeMaxLimit}
              step={10}
              value={range}
              onValueChange={handleChange}
              onValueCommit={handleCommit}
              className="w-full"
            />
          </div>

          {/* Min/Max Inputs */}
          <div className="flex justify-between gap-3">
            <div className="relative">
              <span className="absolute left-5 top-0 px-1 bg-background transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                {t("titleMin")}
              </span>
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <input
                type="number"
                value={inputMin}
                onFocus={() => {
                  isUserInteracting.current = true;
                  isEditingInput.current = true;
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputMin(value);

                  // Обновляем слайдер только если введено валидное число
                  if (value !== "") {
                    const newMin = Number(value);
                    if (
                      !isNaN(newMin) &&
                      newMin >= safeMinLimit &&
                      newMin <= safeMaxLimit
                    ) {
                      const clamped = Math.min(newMin, range[1]);
                      setRange([clamped, range[1]]);
                    }
                  }
                }}
                onBlur={(e) => {
                  isEditingInput.current = false;
                  const value = e.target.value;
                  const newMin = value === "" ? safeMinLimit : Number(value);
                  const clamped = Math.min(
                    Math.max(newMin, safeMinLimit),
                    range[1]
                  );
                  setRange([clamped, range[1]]);
                  setInputMin(String(clamped));
                  onPriceChange(clamped, range[1]);
                  setTimeout(() => {
                    isUserInteracting.current = false;
                  }, 100);
                }}
                className="outline-none w-full pl-6 pr-2 py-2 border border-gray-300 rounded text-sm font-medium 
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none 
                  [-moz-appearance:textfield]"
              />
            </div>
            <div className="relative">
              <span className="absolute left-5 top-0 px-1 bg-background transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                {t("titleMax")}
              </span>
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <input
                type="number"
                value={inputMax}
                onFocus={() => {
                  isUserInteracting.current = true;
                  isEditingInput.current = true;
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputMax(value);

                  // Обновляем слайдер только если введено валидное число
                  if (value !== "") {
                    const newMax = Number(value);
                    if (
                      !isNaN(newMax) &&
                      newMax >= safeMinLimit &&
                      newMax <= safeMaxLimit
                    ) {
                      const clamped = Math.max(newMax, range[0]);
                      setRange([range[0], clamped]);
                    }
                  }
                }}
                onBlur={(e) => {
                  isEditingInput.current = false;
                  const value = e.target.value;
                  const newMax = value === "" ? safeMaxLimit : Number(value);
                  const clamped = Math.max(
                    Math.min(newMax, safeMaxLimit),
                    range[0]
                  );
                  setRange([range[0], clamped]);
                  setInputMax(String(clamped));
                  onPriceChange(range[0], clamped);
                  setTimeout(() => {
                    isUserInteracting.current = false;
                  }, 100);
                }}
                className="outline-none w-full pl-6 pr-2 py-2 border border-gray-300 rounded text-sm font-medium 
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none 
                  [-moz-appearance:textfield]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
