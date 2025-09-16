import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, protectedRoutes } from "@/lib/routes";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "never",
});

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const intlResponse = intlMiddleware(req);

  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  const path = req.nextUrl.pathname;
  const pathWithoutLocale = path.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  console.log("Middleware - Is protected route:", isProtectedRoute);
  const isPublicRoute = publicRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // 3. Get sessionToken from cookies
  const sessionToken = req.cookies.get("sessionToken")?.value;
  console.log("Middleware - Current path:", path);
  console.log("Middleware - SessionToken exists:", !!sessionToken);

  // 4. Redirect to /auth if the user is not authenticated on protected routes
  if (isProtectedRoute && !sessionToken) {
    console.log("Middleware - Redirecting to /auth (not authenticated)");
    const locale = path.split("/")[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/auth`, req.nextUrl));
  }

  // 5. Redirect to /marketplace if the user is authenticated on auth page
  if (pathWithoutLocale === "/auth" && sessionToken) {
    console.log(
      "Middleware - Redirecting to /marketplace (already authenticated)"
    );
    const locale = path.split("/")[1] || defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}/marketplace`, req.nextUrl)
    );
  }

  return intlResponse;
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
