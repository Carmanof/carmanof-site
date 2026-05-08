import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_DOMAIN = "carmanof.ru";

export const config = {
  matcher: [
    /*
      Это ключ:
      middleware НЕ запускается на assets вообще
    */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|images|.*\\..*).*)",
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";

  if (host !== MAIN_DOMAIN) {
    url.hostname = MAIN_DOMAIN;
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}
