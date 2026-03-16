import { PrayerCheckRepository } from "../dal/prayer_check.repository";

export class PrayerCheckService {
  private repo: PrayerCheckRepository;

  constructor(repo?: PrayerCheckRepository) {
    this.repo = repo || new PrayerCheckRepository();
  }

  async markAndGetCount(userId: number, targetUserId: number): Promise<number> {
    await this.repo.markCheck(userId, targetUserId);
    return this.repo.getCountToday(targetUserId);
  }

  async getTodayCheckedTargets(userId: number): Promise<number[]> {
    return this.repo.getTodayCheckedTargets(userId);
  }

  async getCountToday(targetUserId: number): Promise<number> {
    return this.repo.getCountToday(targetUserId);
  }
}

export const prayerCheckService = new PrayerCheckService();
