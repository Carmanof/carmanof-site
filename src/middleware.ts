import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // НЕ редиректим файлы (OG, картинки, и т.д.)
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("https://carmanof.ru" + pathname));
}
