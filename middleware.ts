import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, protectedRoutes } from "@/lib/routes";
import createMiddleware from "next-intl/middleware";
import { locales } from "@/i18n/config";

export const middlewareLocale = createMiddleware({
  locales,
  defaultLocale: "en",
});

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  console.log("Middleware - Is protected route:", isProtectedRoute);
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // 3. Get sessionToken from cookies
  const sessionToken = req.cookies.get("sessionToken")?.value;
  console.log("Middleware - Current path:", path);
  console.log("Middleware - SessionToken exists:", !!sessionToken);

  // 4. Redirect to /auth if the user is not authenticated on protected routes
  if (isProtectedRoute && !sessionToken) {
    console.log("Middleware - Redirecting to /auth (not authenticated)");
    return NextResponse.redirect(new URL("/auth", req.nextUrl));
  }

  // 5. Redirect to /marketplace if the user is authenticated on auth page
  if (path === "/auth" && sessionToken) {
    console.log(
      "Middleware - Redirecting to /marketplace (already authenticated)"
    );
    return NextResponse.redirect(new URL("/marketplace", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
