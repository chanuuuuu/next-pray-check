"use server";

import { z } from "zod";
import { userService } from "@/server/services/user.services";
import { redirect } from "next/navigation";

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
  error?: {
    name: string;
    birth: string;
  };
}

export async function actionLogin(formData: FormData) {
  const validationResult = validateloginInput({
    name: formData.get("name") as string,
    birth: formData.get("birth") as string,
  });
  if (!validationResult.success) {
    if (validationResult.error.name) redirect("/login?errorCode=01");
    if (validationResult.error.birth) redirect("/login?errorCode=02");
    redirect("/login?errorCode=03");
  }

  // DB 데이터 조회
  const user = await userService.fetchUser({
    name: validationResult.data.name,
    birth: validationResult.data.birth,
  });

  if (!user) redirect("/login?errorCode=04");

  // Session 데이터 저장
  // 데이터 암호화

  redirect("/requests");
}
