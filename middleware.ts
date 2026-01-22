import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // DEBUG MODE: Pass through everything to rule out middleware interference
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
