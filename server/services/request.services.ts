import { RequestRepository } from "../dal/request.repository";
import { ModifyRequest, Request } from "@/types/request.type";
import { getWeekDay } from "@/app/utils/utils";

export class RequestService {
  private requestRepository: RequestRepository;

  constructor(requestRepository?: RequestRepository) {
    this.requestRepository = requestRepository || new RequestRepository();
  }

  async fetchRequests(groupId: number, weekId?: number): Promise<Request[]> {
    const queryWeekId = weekId || (await getWeekDay()) - 2;
    return await this.requestRepository.getRequests(groupId, queryWeekId);
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
}

export const requestService = new RequestService();
