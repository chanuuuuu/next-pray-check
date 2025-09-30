"use server";

import { userService } from "@/server/services/user.services";
import { User } from "@/types/user.type";
import { UserFormType } from "@/types/modify.type";
import { validateInput } from "../utils/validation";
import { getLevel, getGisu } from "../utils/utils";
import { ERROR_MESSAGES } from "@/app/utils/constants";

export interface RegistError {
  name?: string;
  birth?: string;
  cellId?: string;
  level?: string;
  user?: string; // 중복 유저 관련 에러
  regist?: string; // 등록 관련 에러
}

export interface RegistState {
  success: boolean;
  error?: RegistError;
  placeholder?: UserFormType;
  isRegist?: boolean;
}

export async function actionRegist(
  state: RegistState,
  formData: FormData
): Promise<RegistState> {
  const inputData: UserFormType = {
    name: formData.get("name") as string,
    birth: formData.get("birth") as string,
    groupId: Number(formData.get("groupId")) as number,
    cellId: Number(formData.get("cellId")) as number,
    level: formData.get("level") as string,
  };

  const validationResult = await validateInput(inputData);

  if (!validationResult.success) {
    return createErrorResponse(state, inputData, {
      name: validationResult.error.name,
      birth: validationResult.error.birth,
      cellId: validationResult.error.cellId,
      level: validationResult.error.level,
    });
  }

  const level = await getLevel(validationResult.data.level);
  const gisu = await getGisu(validationResult.data.birth);

  const modifyUser = {
    name: validationResult.data.name,
    birth: validationResult.data.birth,
    groupId: validationResult.data.groupId,
    cellId: validationResult.data.cellId,
    level: level,
    gisu: gisu,
    userId: state.placeholder?.userId,
  } as User;

  const isRegist = !!state?.isRegist;
  const errorMsg = isRegist
    ? ERROR_MESSAGES.USER_REGISTRATION_FAILED
    : ERROR_MESSAGES.USER_UPDATE_FAILED;

  try {
    if (!isRegist && !modifyUser?.userId) throw new Error(errorMsg);

    const modify = await userService.modifyUser(modifyUser, isRegist);

    if (!modify) throw new Error(errorMsg);
  } catch (e) {
    return createErrorResponse(state, inputData, {
      regist:
        e instanceof Error ? e.message : ERROR_MESSAGES.USER_UPDATE_FAILED,
    });
  }

  return createSuccessResponse(state, inputData);
}

function createErrorResponse(
  state: RegistState,
  inputData: UserFormType,
  error: RegistError
): RegistState {
  return {
    success: false,
    error,
    placeholder: {
      ...state.placeholder,
      name: inputData.name,
      birth: inputData.birth,
      cellId: inputData.cellId,
      level: inputData.level,
    },
    isRegist: state.isRegist,
  };
}

function createSuccessResponse(
  state: RegistState,
  inputData: UserFormType
): RegistState {
  return {
    success: true,
    error: undefined,
    placeholder: {
      ...state.placeholder,
    },
    isRegist: state.isRegist,
  };
}
