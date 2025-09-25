"use server";

import { userService } from "@/server/services/user.services";
import { User } from "@/types/user.type";
import { validateInput } from "../utils/validation";
import { getLevel, getGisu } from "../utils/utils";

export interface FormDataType {
  name?: string;
  birth?: string;
  cellId?: number;
  level?: string;
  groupId?: number;
}

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
  // 입력값 유지를 위한 필드 추가
  formData?: FormDataType;
}

export async function actionRegist(
  state: RegistState,
  formData: FormData
): Promise<RegistState> {
  // 입력된 값들을 저장
  const inputData = {
    name: formData.get("name") as string,
    birth: formData.get("birth") as string,
    groupId: Number(formData.get("groupId")) as number,
    cellId: Number(formData.get("cellId")) as number,
    level: formData.get("level") as string,
  };

  const validationResult = await validateInput(inputData);

  if (!validationResult.success) {
    return {
      success: false,
      error: {
        name: validationResult.error.name,
        birth: validationResult.error.birth,
        cellId: validationResult.error.cellId,
        level: validationResult.error.level,
      },
      // 입력값 유지
      formData: {
        name: inputData.name,
        birth: inputData.birth,
        cellId: inputData.cellId,
        level: inputData.level,
      },
    };
  }

  const level = await getLevel(validationResult.data.level);
  const gisu = await getGisu(validationResult.data.birth);

  // DB 데이터 생성
  const regist = await userService.createUser({
    name: validationResult.data.name,
    birth: validationResult.data.birth,
    groupId: validationResult.data.groupId,
    cellId: validationResult.data.cellId,
    level: level,
    gisu: gisu,
  } as User);

  if (!regist) {
    return {
      success: false,
      error: {
        regist: "사용자 등록에 실패하였습니다. 잠시후 재시도 해주세요.",
      },
      // 실패 시에도 입력값 유지
      formData: {
        name: inputData.name,
        birth: inputData.birth,
        cellId: inputData.cellId,
        level: inputData.level,
      },
    };
  }

  return {
    success: true,
    error: undefined,
    // 성공 시에는 formData를 제거하여 form 초기화
    formData: undefined,
  };
}
