import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // ЖЁСТКО убираем trailing slash ТОЛЬКО для static
  if (url.pathname.startsWith("/_next/static/")) {
    url.pathname = url.pathname.replace(/\/$/, "");
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}