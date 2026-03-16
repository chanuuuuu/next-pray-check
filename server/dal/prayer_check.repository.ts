import { sql } from "@/db/neon";

export class PrayerCheckRepository {
  async markCheck(userId: number, targetUserId: number): Promise<boolean> {
    const result = await sql`
      INSERT INTO prayer_checks (user_id, target_user_id, checked_date)
      VALUES (${userId}, ${targetUserId}, CURRENT_DATE)
      ON CONFLICT (user_id, target_user_id, checked_date) DO NOTHING
      RETURNING user_id;
    `;
    return result.length > 0;
  }

  async getTodayCheckedTargets(userId: number): Promise<number[]> {
    const result = await sql`
      SELECT target_user_id
      FROM prayer_checks
      WHERE user_id = ${userId}
        AND checked_date = CURRENT_DATE;
    `;
    return result.map((r) => r.target_user_id as number);
  }

  async getCountToday(targetUserId: number): Promise<number> {
    const result = await sql`
      SELECT COUNT(*) AS count
      FROM prayer_checks
      WHERE target_user_id = ${targetUserId}
        AND checked_date = CURRENT_DATE;
    `;
    return parseInt(result[0]?.count as string) || 0;
  }
}
