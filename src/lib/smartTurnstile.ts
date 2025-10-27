import { turnstileConfig } from "./turnstile";

interface TurnstileValidationResult {
  isValid: boolean;
  token?: string;
  error?: string;
  shouldSkipBackendValidation?: boolean;
}

export function preValidateTurnstile(
  token: string | null
): TurnstileValidationResult {
  if (!turnstileConfig.isConfigured()) {
    return {
      isValid: true,
      shouldSkipBackendValidation: true,
    };
  }

  if (!token) {
    return {
      isValid: false,
      error: "Turnstile token is required",
    };
  }

  if (typeof token !== "string" || token.length < 10) {
    return {
      isValid: false,
      error: "Invalid token format",
    };
  }

  return {
    isValid: true,
    token,
    shouldSkipBackendValidation: false,
  };
}

export function createSmartTurnstileValidator() {
  return {
    frontendCheck: (token: string | null) => {
      const result = preValidateTurnstile(token);

      if (!result.isValid) {
        console.warn("Turnstile frontend validation failed:", result.error);
      }

      return result;
    },

    backendCheck: async (token: string, clientIP?: string) => {
      throw new Error("backendCheck should only be called on the server side");
    },

    fullValidation: async (token: string | null, clientIP?: string) => {
      const frontendResult = preValidateTurnstile(token);

      if (!frontendResult.isValid) {
        return frontendResult;
      }

      if (frontendResult.shouldSkipBackendValidation) {
        return { isValid: true };
      }

      throw new Error(
        "fullValidation should only be called on the server side"
      );
    },
  };
}
