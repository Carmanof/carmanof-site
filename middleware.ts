import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ❗ КРИТИЧНО: не трогаем Next.js runtime assets
  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // здесь уже можно делать свои правила (если нужны)
  return NextResponse.next();
}
