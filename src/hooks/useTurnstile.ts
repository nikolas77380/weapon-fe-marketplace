"use client";

import { useState, useCallback } from "react";

interface UseTurnstileOptions {
  siteKey: string;
  onError?: (error: string) => void;
}

interface UseTurnstileReturn {
  token: string | null;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: (error: string) => void;
  reset: () => void;
}

export const useTurnstile = ({
  siteKey,
  onError,
}: UseTurnstileOptions): UseTurnstileReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = useCallback((newToken: string) => {
    setToken(newToken);
    setIsVerified(true);
    setIsLoading(false);
    setError(null);
  }, []);

  const handleExpire = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setError("Verification expired. Please try again.");
  }, []);

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      setIsVerified(false);
      setIsLoading(false);
      onError?.(errorMessage);
    },
    [onError]
  );

  const reset = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    token,
    isVerified,
    isLoading,
    error,
    onVerify: handleVerify,
    onExpire: handleExpire,
    onError: handleError,
    reset,
  };
};
