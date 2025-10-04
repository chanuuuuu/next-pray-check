import { requestService } from "@/server/services/request.services";
import { getUserBySession } from "@/server/session";
import { NextResponse } from "next/server";

// 기도제목 목록을 조회
export async function GET() {
  try {
    const user = await getUserBySession(); // 권한에 대한 문제는 middleware에서 수행
    if (!user) throw new Error();

    const requests = await requestService.fetchRequests(user.groupId);
    return NextResponse.json(requests);
  } catch (error) {
    console.error("기도제목 조회 에러:", error);
    return NextResponse.json(
      { error: "기도제목 정보를 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
