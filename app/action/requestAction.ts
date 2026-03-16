"use server";

import { getUserBySession } from "@/server/session";
import { getWeekDay } from "../utils/utils";
import { ModifyRequest } from "@/types/request.type";
import { requestService } from "@/server/services/request.services";
import { revalidateTag } from "next/cache";

export type RequestInput = {
  error?: string;
  text: string;
};

export type RequestState = {
  success: boolean;
  requestInputs: RequestInput[];
  isUrgent: boolean;
  insertId: number;
};

function validateRequestTexts(texts: string[]): {
  inputs: RequestInput[];
  hasError: boolean;
} {
  let hasError = false;
  const inputs = texts.map((text) => {
    if (text.length > 0) return { text: text.trim(), error: undefined };
    hasError = true;
    return { text: text.trim(), error: "최소 1자 이상 입력해주세요." };
  });
  return { inputs, hasError };
}

export async function actionRequest(
  state: RequestState,
  formData: FormData
): Promise<RequestState> {
  const inputData: { text: string[]; isUrgent: string } = {
    text: formData.getAll("text") as string[],
    isUrgent: formData.get("isUrgent") as string,
  };

  const isUrgent = !!inputData?.isUrgent;
  const { inputs: nextRequestInputs, hasError } = validateRequestTexts(
    inputData.text
  );

  if (!hasError) {
    const user = await getUserBySession();
    if (!user) {
      return {
        success: false,
        requestInputs: nextRequestInputs,
        insertId: state.insertId,
        isUrgent,
      };
    }

    const targetUserIdRaw = formData.get("targetUserId");
    const targetUserId = targetUserIdRaw ? Number(targetUserIdRaw) : user.userId;

    const weekId = await getWeekDay();

    const modifyRequests = nextRequestInputs.map(
      (request) =>
        ({
          userId: targetUserId,
          text: request.text,
          insertId: state.insertId,
          weekId: weekId,
          isUrgent,
        } as ModifyRequest)
    );

    const result = await requestService.createRequests(modifyRequests);
    if (result) {
      revalidateTag("requests");
      revalidateTag("favoriteRequests");
    }
  }

  return {
    success: !hasError,
    requestInputs: nextRequestInputs,
    insertId: state.insertId,
    isUrgent,
  };
}

export async function actionRequestDelete(requestId: number) {
  return await requestService.deleteRequest(requestId);
}

export async function actionAddFavoriteRequest(
  requestId: number,
  userId: number
) {
  return await requestService.addFavoriteRequest(userId, requestId);
}

export async function actionDeleteFavoriteRequest(
  requestId: number,
  userId: number
) {
  return await requestService.deleteFavoriteRequest(userId, requestId);
}
