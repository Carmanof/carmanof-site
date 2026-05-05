import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_DOMAIN = "carmanof.ru";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // если заходят через vercel.app → редиректим на основной домен
  if (host.includes("vercel.app")) {
    url.host = MAIN_DOMAIN;
    url.protocol = "https";

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}
