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
  isDisabled?: boolean;
}

const PriceRange = ({
  minLimit,
  maxLimit,
  initialMin,
  initialMax,
  onPriceChange,
  isMobile = false,
  isDisabled = false,
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
              disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
