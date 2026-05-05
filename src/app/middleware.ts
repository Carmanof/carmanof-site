import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  // если заходят через vercel.app — запрещаем индексацию
  if (host?.includes("vercel.app")) {
    const response = NextResponse.next();

    // запрещаем индексировать
    response.headers.set("X-Robots-Tag", "noindex, nofollow");

    return response;
  }

  return NextResponse.next();
}
