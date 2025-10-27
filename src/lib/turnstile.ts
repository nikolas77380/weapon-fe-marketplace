export const turnstileConfig = {
  siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",

  secretKey: process.env.TURNSTILE_SECRET_KEY || "",

  isConfigured: () => {
    return !!(turnstileConfig.siteKey && turnstileConfig.secretKey);
  },

  getFrontendConfig: () => {
    if (!turnstileConfig.siteKey) {
      console.warn("⚠️ Turnstile site key not configured");
      return null;
    }

    return {
      siteKey: turnstileConfig.siteKey,
    };
  },

  getBackendConfig: () => {
    if (!turnstileConfig.secretKey) {
      console.warn("⚠️ Turnstile secret key not configured");
      return null;
    }

    return {
      secretKey: turnstileConfig.secretKey,
    };
  },
};
