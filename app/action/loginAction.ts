"use server";

import { z } from "zod";
import { userService } from "@/server/services/user.services";
import { createSession } from "@/server/session";

const UserLoginSchema = z.object({
  name: z.string().min(1, { error: "최소 1자 이상 입력해주세요" }),
  birth: z
    .string()
    .length(6, { error: "6자리 생년월일을 입력해주세요" })
    .regex(/^\d+$/, { error: "생년월일은 숫자만 입력 가능합니다." }),
});

function validateloginInput(input: unknown) {
  const result = UserLoginSchema.safeParse(input);
  if (result.success) return result;
  const e = result.error.flatten().fieldErrors;
  return {
    ...result,
    error: {
      name: e.name ? e.name[0] : "",
      birth: e.birth ? e.birth[0] : "",
    },
  };
}

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
  const validationResult = validateloginInput({
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
