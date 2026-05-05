import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_DOMAIN = "carmanof.ru";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  console.log("MIDDLEWARE HIT:", host); // важно для проверки

  const isWrongDomain =
    host.includes("vercel.app") ||
    host.includes("www.") ||
    host !== MAIN_DOMAIN;

  if (isWrongDomain) {
    url.hostname = MAIN_DOMAIN;
    url.protocol = "https";

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
