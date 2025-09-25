"use server";

import { z } from "zod";
import { LEVEL_OPTIONS } from "./constants";

const UserLoginSchema = z.object({
  name: z.string().min(1, { error: "최소 1자 이상 입력해주세요" }),
  birth: z
    .string()
    .length(6, { error: "6자리 생년월일을 입력해주세요" })
    .regex(/^\d+$/, { error: "생년월일은 숫자만 입력 가능합니다." }),
});

const LevelValues = Object.values(LEVEL_OPTIONS).map((option) => option.label);

const UserRegistSchema = UserLoginSchema.extend({
  groupId: z.number().min(1, { message: "그룹을 선택해주세요" }),
  cellId: z.number().min(1, { message: "셀을 선택해주세요" }),
  level: z.enum(LevelValues, { message: "권한을 선택해주세요" }),
});

export async function validateInput(input: unknown) {
  const result = UserRegistSchema.safeParse(input);
  if (result.success) return result;
  const e = z.flattenError(result.error).fieldErrors;
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

export async function validateLoginInput(input: unknown) {
  const result = UserLoginSchema.safeParse(input);
  if (result.success) return result;
  const e = z.flattenError(result.error).fieldErrors;
  return {
    ...result,
    error: {
      name: e.name ? e.name[0] : "",
      birth: e.birth ? e.birth[0] : "",
    },
  };
}
// 기도제목 입력 검증
// 출석 입력 검증
