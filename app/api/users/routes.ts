import { userService } from "@/server/services/user.services";
import { NextResponse } from "next/server";
import { getUserBySession } from "@/server/session";

export async function GET() {
  try {
    const user = await getUserBySession(); // 권한에 대한 문제는 middleware에서 수행
    if (!user) throw new Error();

    const users = await userService.fetchUsers(user.groupId!);
    return NextResponse.json(users);
  } catch (error) {
    console.error("리더 조회 에러:", error);
    return NextResponse.json(
      { error: "리더 정보를 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
