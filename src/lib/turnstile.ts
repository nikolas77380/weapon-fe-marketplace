export const turnstileConfig = {
  siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",

  secretKey: process.env.TURNSTILE_SECRET_KEY || "",

  disabled:
    process.env.NEXT_PUBLIC_TURNSTILE_DISABLED === "true" ||
    process.env.TURNSTILE_DISABLED === "true",

  isConfigured: () => {
    if (turnstileConfig.disabled) return false;
    return !!(turnstileConfig.siteKey && turnstileConfig.secretKey);
  },

  getFrontendConfig: () => {
    if (turnstileConfig.disabled) {
      console.warn("⚠️ Turnstile is disabled via env flag");
      return null;
    }

    if (!turnstileConfig.siteKey) {
      console.warn("⚠️ Turnstile site key not configured");
      return null;
    }

    return {
      siteKey: turnstileConfig.siteKey,
    };
  },

  getBackendConfig: () => {
    if (turnstileConfig.disabled) {
      console.warn("⚠️ Turnstile is disabled via env flag");
      return null;
    }

    if (!turnstileConfig.secretKey) {
      console.warn("⚠️ Turnstile secret key not configured");
      return null;
    }

    return {
      secretKey: turnstileConfig.secretKey,
    };
  },
};
