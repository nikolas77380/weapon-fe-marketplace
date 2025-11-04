"use client";

import React, { useEffect, useState, useRef } from "react";

interface TopProgressBarProps {
  isLoading?: boolean;
}

export function TopProgressBar({ isLoading = false }: TopProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Сбрасываем прогресс при начале загрузки
      setProgress(0);

      // Имитация прогресса загрузки (как в YouTube)
      let currentProgress = 0;

      intervalRef.current = setInterval(() => {
        if (currentProgress < 90) {
          // Быстро растем в начале, затем замедляемся
          let increment;
          if (currentProgress < 30) {
            increment = Math.random() * 10 + 5; // 5-15% быстрый рост
          } else if (currentProgress < 70) {
            increment = Math.random() * 5 + 2; // 2-7% средний рост
          } else {
            increment = Math.random() * 2 + 0.5; // 0.5-2.5% медленный рост до 90%
          }

          currentProgress = Math.min(currentProgress + increment, 90);
          setProgress(currentProgress);
        } else {
          // Останавливаемся на 90% и ждем завершения загрузки
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 100);
    } else {
      // Загрузка завершена - быстро доходим до 100%
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setProgress(100);

      // Скрываем через небольшую задержку
      const timer = setTimeout(() => {
        setProgress(0);
      }, 300);

      return () => clearTimeout(timer);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none">
      <div className="relative h-full w-full">
        {/* Прогресс-бар, заполняющийся слева направо */}
        <div
          className="absolute top-0 left-0 h-full bg-gold-main transition-all duration-150 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
