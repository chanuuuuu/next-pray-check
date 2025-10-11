"use server";

import { getUserBySession } from "@/server/session";
import { getWeekDay } from "../utils/utils";
import { ModifyRequest } from "@/types/request.type";
import { requestService } from "@/server/services/request.services";

export interface RequestInput {
  error?: string;
  text: string;
}

export interface RequestState {
  success: boolean;
  requestInputs: RequestInput[];
  isUrgent: boolean;
  insertId: number;
}

export async function actionRequest(
  state: RequestState,
  formData: FormData
): Promise<RequestState> {
  console.log(state.insertId);
  const inputData: { text: string[]; isUrgent: string } = {
    text: formData.getAll("text") as string[],
    isUrgent: formData.get("isUrgent") as string,
  };

  let isError = false;

  const isUrgent = !!inputData?.isUrgent;
  const nextRequestInputs = inputData.text?.map((request) => {
    if (request.length > 0)
      return {
        text: request.trim(),
        error: undefined,
      };

    isError = true;
    return {
      text: request.trim(),
      error: "최소 1자 이상 입력해주세요.",
    };
  });

  if (!isError) {
    const user = await getUserBySession();
    if (!user) {
      return {
        success: false,
        requestInputs: nextRequestInputs,
        insertId: state.insertId,
        isUrgent,
      };
    }

    const weekId = await getWeekDay();

    const modifyRequests = nextRequestInputs.map(
      (request) =>
        ({
          userId: user?.userId,
          text: request.text,
          insertId: state.insertId,
          weekId: weekId,
          isUrgent,
        } as ModifyRequest)
    );

    await requestService.createRequests(modifyRequests);
  }

  return {
    success: !isError,
    requestInputs: nextRequestInputs,
    insertId: state.insertId,
    isUrgent,
  };
}
