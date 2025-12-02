import { RequestRepository } from "../dal/request.repository";
import { ModifyRequest, Request } from "@/types/request.type";
import { getWeekDay } from "@/app/utils/utils";
import { unstable_cache } from "next/cache";

export class RequestService {
  private requestRepository: RequestRepository;

  constructor(requestRepository?: RequestRepository) {
    this.requestRepository = requestRepository || new RequestRepository();
  }

  async fetchRequests(groupId: number, weekId?: number): Promise<Request[]> {
    const queryWeekId = weekId || (await getWeekDay()) - 2;
    return unstable_cache(
      async (): Promise<Request[]> => {
        return this.requestRepository.getRequests(groupId, queryWeekId);
      },
      ["requests", groupId.toString(), queryWeekId.toString()],
      { tags: ["requests"], revalidate: 5 * 60 }
    )();
  }

  async createRequests(requests: ModifyRequest[]): Promise<boolean> {
    try {
      const result = await this.requestRepository.createRequests(requests);
      if (result) return true;
      throw new Error("Request create failed");
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async deleteRequest(requestId: number): Promise<boolean> {
    try {
      const result = await this.requestRepository.deleteRequest(requestId);
      if (result) return true;
      throw new Error("Request delete failed");
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async fetchFavoriteRequests(userId: number): Promise<number[]> {
    const queryWeekId = (await getWeekDay()) - 2;
    return unstable_cache(
      async (): Promise<number[]> => {
        return this.requestRepository.getFavoriteRequests(userId, queryWeekId);
      },
      ["favoriteRequests", userId.toString(), queryWeekId.toString()],
      { tags: ["favoriteRequests"], revalidate: 5 * 60 }
    )();
  }

  async addFavoriteRequest(
    userId: number,
    requestId: number
  ): Promise<boolean> {
    try {
      return await this.requestRepository.addFavoriteRequest(userId, requestId);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async deleteFavoriteRequest(
    userId: number,
    requestId: number
  ): Promise<boolean> {
    try {
      return await this.requestRepository.deleteFavoriteRequest(
        userId,
        requestId
      );
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export const requestService = new RequestService();
