"use server";

import { userService } from "@/server/services/user.services";
import { User } from "@/types/user.type";
import { validateInput } from "../utils/validation";
import { getLevel, getGisu } from "../utils/utils";
import { USER_MODIFY_TYPES } from "../utils/constants";

export interface UserFormType {
  userId?: number;
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
  placeholder?: UserFormType;
  modifyType?: string;
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
      placeholder: {
        ...state.placeholder,
        name: inputData.name,
        birth: inputData.birth,
        cellId: inputData.cellId,
        level: inputData.level,
      },
      modifyType: state.modifyType,
    };
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

  if (state.modifyType === USER_MODIFY_TYPES.UPDATE) {
    if (!modifyUser?.userId) {
      return {
        success: false,
        error: {
          regist: "사용자 정보변경에 실패하였습니다. 잠시후 재시도 해주세요.",
        },
        // 실패 시에도 입력값 유지
        placeholder: {
          userId: state.placeholder?.userId,
          name: inputData.name,
          birth: inputData.birth,
          cellId: inputData.cellId,
          level: inputData.level,
        },
        modifyType: state.modifyType,
      };
    }
    const update = await userService.updateUser(modifyUser);

    if (!update) {
      return {
        success: false,
        error: {
          regist: "사용자 정보변경에 실패하였습니다. 잠시후 재시도 해주세요.",
        },
        // 실패 시에도 입력값 유지
        placeholder: {
          ...state.placeholder,
          name: inputData.name,
          birth: inputData.birth,
          cellId: inputData.cellId,
          level: inputData.level,
        },
        modifyType: state.modifyType,
      };
    }
  } else {
    const regist = await userService.createUser(modifyUser);

    if (!regist) {
      return {
        success: false,
        error: {
          regist: "사용자 등록에 실패하였습니다. 잠시후 재시도 해주세요.",
        },
        // 실패 시에도 입력값 유지
        placeholder: {
          ...state.placeholder,
          name: inputData.name,
          birth: inputData.birth,
          cellId: inputData.cellId,
          level: inputData.level,
        },
        modifyType: state.modifyType,
      };
    }
  }

  return {
    success: true,
    error: undefined,
    placeholder: {
      ...state.placeholder,
    },
    modifyType: state.modifyType,
  };
}
