"use server";

import { userService } from "@/server/services/user.services";
import { createSession, deleteSession } from "@/server/session";
import { validateLoginInput } from "../utils/validation";

export interface UserState {
  success: boolean;
  error:
    | {
        name?: string;
        birth?: string;
        user?: string;
      }
    | undefined;
}

export async function actionLogin(
  state: UserState,
  formData: FormData
): Promise<UserState> {
  const validationResult = await validateLoginInput({
    name: formData.get("name") as string,
    birth: formData.get("birth") as string,
  });

  if (!validationResult.success) {
    return {
      success: false,
      error: {
        name: validationResult.error.name,
        birth: validationResult.error.birth,
      },
    };
  }

  // DB 데이터 조회
  const user = await userService.fetchUser({
    name: validationResult.data.name,
    birth: validationResult.data.birth,
  });

  if (!user)
    return {
      success: false,
      error: {
        user: "사용자가 존재하지 않습니다.",
      },
    };

  // session 생성하기.
  await createSession(user);

  return {
    success: true,
    error: undefined,
  };
}

export async function actionLogout() {
  await deleteSession();
}
