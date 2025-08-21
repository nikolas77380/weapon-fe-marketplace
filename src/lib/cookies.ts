// Client-side cookie utilities only
export const setClientCookie = (
  name: string,
  value: string,
  options?: {
    maxAge?: number;
    path?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  }
) => {
  const maxAge = options?.maxAge || 60 * 60 * 24 * 7; // 7 days default
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();

  let cookieString = `${name}=${value}; expires=${expires}; path=${
    options?.path || "/"
  }`;

  if (options?.secure || process.env.NODE_ENV === "production") {
    cookieString += "; secure";
  }

  if (options?.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

export const getClientCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export const deleteClientCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
