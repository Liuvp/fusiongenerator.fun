import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { LOCALES } from "@/lib/i18n";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  // const LOCALES = ["en", "ja"] as const; // Removed
  const seg = pathname.split("/")[1];
  const hasLocale = (LOCALES as readonly string[]).includes(seg);

  // If locale-prefixed, strip locale and serve underlying route
  if (hasLocale) {
    const stripped = "/" + pathname.split("/").slice(2).join("/");
    const targetPath = stripped === "/" ? "/" : stripped;

    // For dashboard, use redirect so auth middleware runs again on the target path
    if (targetPath.startsWith("/dashboard")) {
      url.pathname = targetPath;
      const res = NextResponse.redirect(url);
      res.cookies.set("locale", seg);
      return res;
    }

    url.pathname = targetPath;
    const res = NextResponse.rewrite(url);
    res.cookies.set("locale", seg);
    return res;
  }

  // Default supabase session handling
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
