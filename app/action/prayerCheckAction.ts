"use server";

import { getUserBySession } from "@/server/session";
import { prayerCheckService } from "@/server/services/prayer_check.service";

export async function actionPrayerCheck(targetUserId: number): Promise<number> {
  const user = await getUserBySession();
  if (!user) return 0;
  return prayerCheckService.markAndGetCount(user.userId, targetUserId);
}

export async function actionGetPrayCount(targetUserId: number): Promise<number> {
  return prayerCheckService.getCountToday(targetUserId);
}
