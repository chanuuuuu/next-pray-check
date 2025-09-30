"use server";

import { User } from "@/types/user.type";
import { userService } from "@/server/services/user.services";

export async function actionDelete(user: User) {
  return await userService.deleteUser(user);
}
