import { userService } from "@/server/services/user.services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const leaders = await userService.getLeaders();
    return NextResponse.json(leaders);
  } catch (error) {
    console.error("리더 조회 에러:", error);
    return NextResponse.json(
      { error: "리더 정보를 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
