import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // не трогаем файлы
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // ничего не редиректим по домену!
  return NextResponse.next();
}
