"use client";

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  className?: string;
}

export interface TurnstileRef {
  reset: () => void;
  getResponse: () => string | undefined;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  (
    {
      siteKey,
      onVerify,
      onError,
      onExpire,
      theme = "auto",
      size = "normal",
      className = "",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        setIsError(true);
        onError?.("Failed to load Turnstile script");
      };

      document.head.appendChild(script);

      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
        }
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }, [onError]);

    useEffect(() => {
      if (isLoaded && containerRef.current && !widgetIdRef.current) {
        // Проверяем валидность siteKey
        if (!siteKey || siteKey.length < 10) {
          setIsError(true);
          onError?.("Invalid site key configuration");
          return;
        }

        try {
          const widgetId = window.turnstile?.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            size,
            callback: (token: string) => {
              onVerify(token);
            },
            "error-callback": (error: string) => {
              setIsError(true);
              onError?.(error);
            },
            "expired-callback": () => {
              onExpire?.();
            },
          });

          if (widgetId) {
            widgetIdRef.current = widgetId;
          } else {
            setIsError(true);
            onError?.("Failed to initialize Turnstile widget");
          }
        } catch (error) {
          setIsError(true);
          onError?.("Failed to render Turnstile widget");
        }
      }
    }, [isLoaded, siteKey, theme, size, onVerify, onError, onExpire]);

    const resetWidget = () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setIsError(false);
      }
    };

    const getResponse = () => {
      if (widgetIdRef.current && window.turnstile) {
        return window.turnstile.getResponse(widgetIdRef.current);
      }
      return undefined;
    };

    useImperativeHandle(ref, () => ({
      reset: resetWidget,
      getResponse,
    }));

    if (isError) {
      return (
        <div
          className={`flex flex-col items-center justify-center p-4 border border-orange-200 rounded-lg bg-orange-50 ${className}`}
        >
          <div className="text-orange-600 text-sm mb-2 text-center">
            Security verification unavailable
          </div>
          <div className="text-orange-500 text-xs mb-2 text-center">
            You can still submit the form, but it may be less secure
          </div>
          <button
            onClick={resetWidget}
            className="text-orange-600 hover:text-orange-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div
          className={`flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50 ${className}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <span className="text-gray-600 text-sm">
              Loading security verification...
            </span>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        ref={containerRef}
        className={className}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    );
  }
);

Turnstile.displayName = "Turnstile";

export default Turnstile;
