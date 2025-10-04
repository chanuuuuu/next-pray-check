import { RequestRepository } from "../dal/request.repository";
import { Request } from "@/types/request.type";
import { getWeekDay } from "@/app/utils/utils";

export class RequestService {
  private requestRepository: RequestRepository;

  constructor(requestRepository?: RequestRepository) {
    this.requestRepository = requestRepository || new RequestRepository();
  }

  async fetchRequests(groupId: number, weekId?: number): Promise<Request[]> {
    const queryWeekId = weekId || getWeekDay() + 2;
    return await this.requestRepository.getRequests(groupId, queryWeekId);
  }
}

export const requestService = new RequestService();
