"use server";

// User 등록을 수행하기 위한 입력값 검증할 schema 정의
import { userService } from "@/server/services/user.services";
import { User } from "@/types/user.type";

import { z } from "zod";

const UserRegistSchema = z.object({
  name: z.string().min(1, { error: "최소 1자 이상 입력해주세요" }),
  birth: z
    .string()
    .length(6, { error: "6자리 생년월일을 입력해주세요" })
    .regex(/^\d+$/, { error: "생년월일은 숫자만 입력 가능합니다." }),
  groupId: z.number().min(1, { error: "그룹을 선택해주세요" }),
  cellId: z.number().min(1, { error: "셀을 선택해주세요" }),
  level: z.number().min(1, { error: "권한을 선택해주세요" }),
});

export interface RegistState {
  success: boolean;
  error:
    | {
        name?: string;
        birth?: string;
        cellId?: string;
        level?: string;
        user?: string; // 중복 유저 관련 에러
        regist?: string; // 등록 관련 에러
      }
    | undefined;
}

function validateRegistInput(input: unknown) {
  const result = UserRegistSchema.safeParse(input);
  if (result.success) return result;
  const e = result.error.flatten().fieldErrors;
  return {
    ...result,
    error: {
      name: e.name ? e.name[0] : "",
      birth: e.birth ? e.birth[0] : "",
      cellId: e.cellId ? e.cellId[0] : "",
      level: e.level ? e.level[0] : "",
    },
  };
}

function getGisu(birth: string) {
  if (!birth) return 0;
  const BASE = {
    fullYear: "1994",
    gisu: 35,
  };
  const year = birth.slice(0, 2);
  const fullYear = (parseInt(year) > 80 ? "19" : "20") + year;
  const gap = parseInt(fullYear) - parseInt(BASE.fullYear);
  const targetGisu = BASE.gisu + (gap || 0);
  return targetGisu;
}

export async function actionRegist(
  state: RegistState,
  formData: FormData
): Promise<RegistState> {
  const validationResult = validateRegistInput({
    name: formData.get("name") as string,
    birth: formData.get("birth") as string,
    groupId: Number(formData.get("groupId")) as number,
    cellId: Number(formData.get("cellId")) as number,
    level: Number(formData.get("level")) as number,
  });

  if (!validationResult.success) {
    return {
      success: false,
      error: {
        name: validationResult.error.name,
        birth: validationResult.error.birth,
        cellId: validationResult.error.cellId,
        level: validationResult.error.level,
      },
    };
  }
  // DB 데이터 생성
  const regist = await userService.createUser({
    name: validationResult.data.name,
    birth: validationResult.data.birth,
    groupId: validationResult.data.groupId,
    cellId: validationResult.data.cellId,
    level: validationResult.data.level,
    gisu: getGisu(validationResult.data.birth),
  } as User);

  if (!regist) {
    return {
      success: false,
      error: {
        regist: "사용자 등록에 실패하였습니다. 잠시후 재시도 해주세요.",
      },
    };
  }

  return {
    success: true,
    error: undefined,
  };
}
