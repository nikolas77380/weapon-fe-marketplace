"use server";

import { cookies } from "next/headers";
import { cookieName, defaultLocale, Locale } from "./config";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = cookieName;

export async function getUserLocale() {
  const cookieStore = await cookies();
  const saved = cookieStore.get(COOKIE_NAME)?.value;

  // Just return defaultLocale if there is no cookie
  return saved || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  const cookieResponse = await cookies();
  cookieResponse.set(COOKIE_NAME, locale);
}
