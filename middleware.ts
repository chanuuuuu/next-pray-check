import { getUserBySession } from "@/server/session";
import { NextRequest, NextResponse } from "next/server";

// 페이지 진입에 대해서만 권한을 체크한다. API 요청에 대해서는 API 측에서 관리한다.
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/regist", "/requests", "/"];

  if (protectedRoutes.includes(pathname)) {
    // 세션 체크
    const user = await getUserBySession();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 권한 체크
    if (pathname === "/regist") {
      // 상수화 필요
      //   if (session.level == 1) {
      //     return NextResponse.redirect(new URL("/requests", request.url));
      //   }
    }
  }

  return NextResponse.next();
}
