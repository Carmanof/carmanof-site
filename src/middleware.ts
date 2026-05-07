import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");

  // защита от vercel.app домена
  if (host?.includes("vercel.app")) {
    return NextResponse.redirect("https://carmanof.ru" + req.nextUrl.pathname);
  }

  return NextResponse.next();
}
