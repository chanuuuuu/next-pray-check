import { RequestService } from "../request.services";
import { RequestRepository } from "../../dal/request.repository";
import { Request, ModifyRequest } from "@/types/request.type";

// next/cache의 unstable_cache는 단위 테스트에서 캐싱 없이 함수를 직접 실행하도록 모킹
jest.mock("next/cache", () => ({
  unstable_cache: jest.fn(
    (fn: () => unknown) =>
      fn // 캐시 없이 함수를 그대로 반환
  ),
  revalidateTag: jest.fn(),
}));

// getWeekDay는 현재 주차를 반환 — 5로 고정 (queryWeekId = 5 - 2 = 3)
jest.mock("@/app/utils/utils", () => ({
  getWeekDay: jest.fn().mockResolvedValue(5),
}));

const mockRequest: Request = {
  requestId: 1,
  text: "테스트 기도제목",
  weekId: 3,
  insertId: 0,
  userId: 10,
  cellId: 2,
  name: "홍길동",
  gisu: 10,
  isUrgent: false,
  isSolved: false,
};

const mockInput: ModifyRequest[] = [
  { userId: 10, text: "기도제목", insertId: 0, weekId: 3 },
];

describe("RequestService", () => {
  let requestService: RequestService;
  let mockRepo: jest.Mocked<RequestRepository>;

  beforeEach(() => {
    mockRepo = {
      initPrayerTable: jest.fn(),
      getRequests: jest.fn(),
      createRequests: jest.fn(),
      deleteRequest: jest.fn(),
      getFavoriteRequests: jest.fn(),
      addFavoriteRequest: jest.fn(),
      deleteFavoriteRequest: jest.fn(),
    } as jest.Mocked<RequestRepository>;

    requestService = new RequestService(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── fetchRequests ────────────────────────────────────────────────────────
  describe("fetchRequests", () => {
    it("기도제목 목록을 반환해야 한다", async () => {
      // Given
      mockRepo.getRequests.mockResolvedValue([mockRequest]);

      // When
      const result = await requestService.fetchRequests(1);

      // Then
      expect(result).toEqual([mockRequest]);
      expect(mockRepo.getRequests).toHaveBeenCalledWith(1, 3); // weekId = 5 - 2
      expect(mockRepo.getRequests).toHaveBeenCalledTimes(1);
    });

    it("weekId를 직접 전달하면 해당 weekId로 조회한다", async () => {
      // Given
      mockRepo.getRequests.mockResolvedValue([]);

      // When
      await requestService.fetchRequests(1, 10);

      // Then
      expect(mockRepo.getRequests).toHaveBeenCalledWith(1, 10);
    });

    it("기도제목이 없으면 빈 배열을 반환해야 한다", async () => {
      // Given
      mockRepo.getRequests.mockResolvedValue([]);

      // When
      const result = await requestService.fetchRequests(1);

      // Then
      expect(result).toEqual([]);
    });

    it("여러 기도제목을 반환할 수 있어야 한다", async () => {
      // Given
      const requests = [
        mockRequest,
        { ...mockRequest, requestId: 2, text: "두 번째 기도제목", userId: 20 },
      ];
      mockRepo.getRequests.mockResolvedValue(requests);

      // When
      const result = await requestService.fetchRequests(1);

      // Then
      expect(result).toHaveLength(2);
      expect(result[0].requestId).toBe(1);
      expect(result[1].requestId).toBe(2);
    });
  });

  // ─── createRequests ───────────────────────────────────────────────────────
  describe("createRequests", () => {
    it("등록 성공 시 true를 반환해야 한다", async () => {
      // Given
      mockRepo.createRequests.mockResolvedValue([{ affectedRows: 1 }]);

      // When
      const result = await requestService.createRequests(mockInput);

      // Then
      expect(result).toBe(true);
      expect(mockRepo.createRequests).toHaveBeenCalledWith(mockInput);
      expect(mockRepo.createRequests).toHaveBeenCalledTimes(1);
    });

    it("repository가 falsy를 반환하면 false를 반환해야 한다", async () => {
      // Given
      mockRepo.createRequests.mockResolvedValue(null);

      // When
      const result = await requestService.createRequests(mockInput);

      // Then
      expect(result).toBe(false);
    });

    it("repository에서 오류 발생 시 false를 반환해야 한다", async () => {
      // Given
      mockRepo.createRequests.mockRejectedValue(new Error("DB error"));

      // When
      const result = await requestService.createRequests(mockInput);

      // Then
      expect(result).toBe(false);
    });

    it("여러 기도제목을 한 번에 등록할 수 있어야 한다", async () => {
      // Given
      const multipleInputs: ModifyRequest[] = [
        { userId: 10, text: "첫 번째", insertId: 0, weekId: 3 },
        { userId: 10, text: "두 번째", insertId: 0, weekId: 3 },
        { userId: 10, text: "세 번째", insertId: 0, weekId: 3 },
      ];
      mockRepo.createRequests.mockResolvedValue([{ affectedRows: 3 }]);

      // When
      const result = await requestService.createRequests(multipleInputs);

      // Then
      expect(result).toBe(true);
      expect(mockRepo.createRequests).toHaveBeenCalledWith(multipleInputs);
    });
  });

  // ─── deleteRequest ────────────────────────────────────────────────────────
  describe("deleteRequest", () => {
    it("삭제 성공 시 true를 반환해야 한다", async () => {
      // Given
      mockRepo.deleteRequest.mockResolvedValue(true);

      // When
      const result = await requestService.deleteRequest(1);

      // Then
      expect(result).toBe(true);
      expect(mockRepo.deleteRequest).toHaveBeenCalledWith(1);
      expect(mockRepo.deleteRequest).toHaveBeenCalledTimes(1);
    });

    it("삭제 실패 시 false를 반환해야 한다", async () => {
      // Given
      mockRepo.deleteRequest.mockResolvedValue(false);

      // When
      const result = await requestService.deleteRequest(1);

      // Then
      expect(result).toBe(false);
    });

    it("repository에서 오류 발생 시 false를 반환해야 한다", async () => {
      // Given
      mockRepo.deleteRequest.mockRejectedValue(new Error("DB error"));

      // When
      const result = await requestService.deleteRequest(1);

      // Then
      expect(result).toBe(false);
    });
  });

  // ─── fetchFavoriteRequests ────────────────────────────────────────────────
  describe("fetchFavoriteRequests", () => {
    it("즐겨찾기 기도제목 ID 배열을 반환해야 한다", async () => {
      // Given
      mockRepo.getFavoriteRequests.mockResolvedValue([1, 2, 3]);

      // When
      const result = await requestService.fetchFavoriteRequests(10);

      // Then
      expect(result).toEqual([1, 2, 3]);
      expect(mockRepo.getFavoriteRequests).toHaveBeenCalledWith(10, 3);
      expect(mockRepo.getFavoriteRequests).toHaveBeenCalledTimes(1);
    });

    it("즐겨찾기가 없으면 빈 배열을 반환해야 한다", async () => {
      // Given
      mockRepo.getFavoriteRequests.mockResolvedValue([]);

      // When
      const result = await requestService.fetchFavoriteRequests(10);

      // Then
      expect(result).toEqual([]);
    });
  });

  // ─── addFavoriteRequest ───────────────────────────────────────────────────
  describe("addFavoriteRequest", () => {
    it("즐겨찾기 추가 성공 시 true를 반환해야 한다", async () => {
      // Given
      mockRepo.addFavoriteRequest.mockResolvedValue(true);

      // When
      const result = await requestService.addFavoriteRequest(10, 1);

      // Then
      expect(result).toBe(true);
      expect(mockRepo.addFavoriteRequest).toHaveBeenCalledWith(10, 1);
      expect(mockRepo.addFavoriteRequest).toHaveBeenCalledTimes(1);
    });

    it("즐겨찾기 추가 실패 시 false를 반환해야 한다", async () => {
      // Given
      mockRepo.addFavoriteRequest.mockResolvedValue(false);

      // When
      const result = await requestService.addFavoriteRequest(10, 1);

      // Then
      expect(result).toBe(false);
    });

    it("repository에서 오류 발생 시 false를 반환해야 한다", async () => {
      // Given
      mockRepo.addFavoriteRequest.mockRejectedValue(new Error("DB error"));

      // When
      const result = await requestService.addFavoriteRequest(10, 1);

      // Then
      expect(result).toBe(false);
    });
  });

  // ─── deleteFavoriteRequest ────────────────────────────────────────────────
  describe("deleteFavoriteRequest", () => {
    it("즐겨찾기 삭제 성공 시 true를 반환해야 한다", async () => {
      // Given
      mockRepo.deleteFavoriteRequest.mockResolvedValue(true);

      // When
      const result = await requestService.deleteFavoriteRequest(10, 1);

      // Then
      expect(result).toBe(true);
      expect(mockRepo.deleteFavoriteRequest).toHaveBeenCalledWith(10, 1);
      expect(mockRepo.deleteFavoriteRequest).toHaveBeenCalledTimes(1);
    });

    it("즐겨찾기 삭제 실패 시 false를 반환해야 한다", async () => {
      // Given
      mockRepo.deleteFavoriteRequest.mockResolvedValue(false);

      // When
      const result = await requestService.deleteFavoriteRequest(10, 1);

      // Then
      expect(result).toBe(false);
    });

    it("repository에서 오류 발생 시 false를 반환해야 한다", async () => {
      // Given
      mockRepo.deleteFavoriteRequest.mockRejectedValue(new Error("DB error"));

      // When
      const result = await requestService.deleteFavoriteRequest(10, 1);

      // Then
      expect(result).toBe(false);
    });
  });
});
