"use server";

import { deleteSession } from "@/server/session";

export async function actionLogout() {
  await deleteSession();
}
