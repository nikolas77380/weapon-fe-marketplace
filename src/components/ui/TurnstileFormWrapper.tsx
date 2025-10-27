"use client";

import React from "react";
import Turnstile from "@/components/ui/turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { turnstileConfig } from "@/lib/turnstile";

interface TurnstileFormWrapperProps {
  children: (turnstile: {
    token: string | null;
    isVerified: boolean;
    isLoading: boolean;
    error: string | null;
    reset: () => void;
  }) => React.ReactNode;
  onError?: (error: string) => void;
  className?: string;
  showTurnstile?: boolean;
}

const TurnstileFormWrapper: React.FC<TurnstileFormWrapperProps> = ({
  children,
  onError,
  className = "",
  showTurnstile = true,
}) => {
  const turnstileFrontendConfig = turnstileConfig.getFrontendConfig();

  const turnstile = useTurnstile({
    siteKey: turnstileFrontendConfig?.siteKey || "",
    onError: (error) => {
      console.error("Turnstile error:", error);
      onError?.(error);
    },
  });

  if (!turnstileFrontendConfig) {
    return (
      <div className={className}>
        {children({
          token: null,
          isVerified: true,
          isLoading: false,
          error: null,
          reset: () => {},
        })}
      </div>
    );
  }

  return (
    <div className={className}>
      {children({
        token: turnstile.token,
        isVerified: turnstile.isVerified,
        isLoading: turnstile.isLoading,
        error: turnstile.error,
        reset: turnstile.reset,
      })}

      {showTurnstile && (
        <div className="flex justify-center my-4">
          <Turnstile
            siteKey={turnstileFrontendConfig.siteKey}
            onVerify={turnstile.onVerify}
            onError={turnstile.onError}
            onExpire={turnstile.onExpire}
            theme="auto"
            size="normal"
          />
        </div>
      )}

      {/* Сообщение об ошибке Turnstile */}
      {turnstile.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          Security verification failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default TurnstileFormWrapper;
