"use client";

import { useState, useCallback, useRef } from "react";
import { preValidateTurnstile } from "@/lib/smartTurnstile";

interface UseSmartTurnstileOptions {
  siteKey: string;
  onError?: (error: string) => void;
  enableBackendValidation?: boolean;
}

interface UseSmartTurnstileReturn {
  token: string | null;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: (error: string) => void;
  reset: () => void;
  validateLocally: () => boolean;
  validateWithBackend: (clientIP?: string) => Promise<boolean>;
}

export const useSmartTurnstile = ({
  siteKey,
  onError,
  enableBackendValidation = true,
}: UseSmartTurnstileOptions): UseSmartTurnstileReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleVerify = useCallback(
    (newToken: string) => {
      setToken(newToken);
      setIsLoading(false);
      setError(null);

      const localValidation = preValidateTurnstile(newToken);

      if (localValidation.isValid) {
        setIsVerified(true);

        if (
          enableBackendValidation &&
          !localValidation.shouldSkipBackendValidation
        ) {
          validationTimeoutRef.current = setTimeout(async () => {
            try {
              const response = await fetch("/api/validate-turnstile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: newToken }),
              });

              const result = await response.json();

              if (!result.isValid) {
                setIsVerified(false);
                setError("Security verification failed");
                onError?.("Backend validation failed");
              }
            } catch (error) {
              console.warn("Backend Turnstile validation failed:", error);
            }
          }, 1000);
        }
      } else {
        setIsVerified(false);
        setError(localValidation.error || "Validation failed");
        onError?.(localValidation.error || "Validation failed");
      }
    },
    [enableBackendValidation, onError]
  );

  const handleExpire = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setError("Verification expired. Please try again.");

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
  }, []);

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      setIsVerified(false);
      setIsLoading(false);
      onError?.(errorMessage);

      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    },
    [onError]
  );

  const reset = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setIsLoading(false);
    setError(null);

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
  }, []);

  const validateLocally = useCallback(() => {
    const result = preValidateTurnstile(token);
    setIsVerified(result.isValid);
    if (!result.isValid) {
      setError(result.error || "Local validation failed");
    }
    return result.isValid;
  }, [token]);

  const validateWithBackend = useCallback(
    async (clientIP?: string) => {
      if (!token) return false;

      setIsLoading(true);

      try {
        const response = await fetch("/api/validate-turnstile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, clientIP }),
        });

        const result = await response.json();

        setIsVerified(result.isValid);
        if (!result.isValid) {
          setError(result.error || "Backend validation failed");
        }

        return result.isValid;
      } catch (error) {
        console.error("Backend validation error:", error);
        setError("Validation service unavailable");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return {
    token,
    isVerified,
    isLoading,
    error,
    onVerify: handleVerify,
    onExpire: handleExpire,
    onError: handleError,
    reset,
    validateLocally,
    validateWithBackend,
  };
};
