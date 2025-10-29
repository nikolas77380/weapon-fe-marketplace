"use client";

import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          try {
            setStoredValue(JSON.parse(item));
          } catch {
            // If not valid JSON, treat as plain string (backward compatibility)
            setStoredValue(item as T);
            // Normalize to JSON format
            window.localStorage.setItem(key, JSON.stringify(item));
          }
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
    }

    // Listen for storage changes (inter-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // If not valid JSON, treat as plain string (backward compatibility)
          setStoredValue(e.newValue as T);
        }
      }
    };

    // Listen for custom currency change event (same-tab updates)
    const handleCurrencyChange = () => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            setStoredValue(JSON.parse(item));
          } catch {
            // If not valid JSON, treat as plain string (backward compatibility)
            setStoredValue(item as T);
            // Normalize to JSON format
            localStorage.setItem(key, JSON.stringify(item));
          }
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("currencyChanged", handleCurrencyChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("currencyChanged", handleCurrencyChange);
    };
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

export default useLocalStorage;
