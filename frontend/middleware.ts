import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/documents",
  "/chat",
  "/notifications",
  "/settings",
  "/profile",
];

const authRoutes = ["/login", "/register"];

const protectedSet = new Set(protectedRoutes);
const authSet = new Set(authRoutes);

function isProtected(pathname: string): boolean {
  if (protectedSet.has(pathname)) return true;
  for (const route of protectedSet) {
    if (pathname.startsWith(route + "/")) return true;
  }
  return false;
}

function isAuthRoute(pathname: string): boolean {
  if (authSet.has(pathname)) return true;
  for (const route of authSet) {
    if (pathname.startsWith(route + "/")) return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  const { pathname, search } = request.nextUrl;
  const isProtectedRoute = isProtected(pathname);
  const authRouteCheck = isAuthRoute(pathname);

  if (!isProtectedRoute && !authRouteCheck) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (authRouteCheck && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
