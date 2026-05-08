import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  // Не трогаем системные файлы Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Редирект с vercel.app
  if (host.includes("vercel.app")) {
    const url = req.nextUrl.clone();

    url.host = "carmanof.ru";
    url.protocol = "https";

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}