import { UserService } from "../user.services";
import { UserRepository } from "../../dal/user.repository";
import { User, UserLoginInput } from "@/types/user.type";

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // 모킹된 UserRepository 인스턴스 생성
    mockUserRepository = {
      getUser: jest.fn(),
      createUser: jest.fn(),
      initUserTable: jest.fn(),
    } as jest.Mocked<UserRepository>;

    // UserService에 모킹된 repository 주입
    userService = new UserService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchUser", () => {
    const mockUserInput: UserLoginInput = {
      name: "홍길동",
      birth: "990101",
    };

    const mockUser: User = {
      groupId: 1,
      cellId: 2,
      name: "홍길동",
      birth: "990101",
      gisu: 10,
      level: 1,
    };

    it("사용자가 존재할 때 User 객체를 반환해야 한다", async () => {
      // Given
      mockUserRepository.getUser.mockResolvedValue(mockUser);

      // When
      const result = await userService.fetchUser(mockUserInput);

      // Then
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.getUser).toHaveBeenCalledWith(mockUserInput);
      expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
    });

    it("사용자가 존재하지 않을 때 undefined를 반환해야 한다", async () => {
      // Given
      mockUserRepository.getUser.mockResolvedValue(undefined);

      // When
      const result = await userService.fetchUser(mockUserInput);

      // Then
      expect(result).toBeUndefined();
      expect(mockUserRepository.getUser).toHaveBeenCalledWith(mockUserInput);
      expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
    });

    it("repository에서 에러가 발생하면 에러를 전파해야 한다", async () => {
      // Given
      const error = new Error("Database connection failed");
      mockUserRepository.getUser.mockRejectedValue(error);

      // When & Then
      await expect(userService.fetchUser(mockUserInput)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockUserRepository.getUser).toHaveBeenCalledWith(mockUserInput);
      expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
    });
  });

  describe("createUser", () => {
    const mockUser: User = {
      groupId: 1,
      cellId: 2,
      name: "김철수",
      birth: "980515",
      gisu: 11,
      level: 2,
    };

    it("사용자 생성이 성공하면 정상적으로 완료되어야 한다", async () => {
      // Given
      const mockResult = [{ insertId: 1, affectedRows: 1 }];
      mockUserRepository.createUser.mockResolvedValue(mockResult);

      // When
      await userService.createUser(mockUser);

      // Then
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(mockUser);
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
    });

    it("사용자 생성이 실패하면 에러를 던져야 한다", async () => {
      // Given
      mockUserRepository.createUser.mockResolvedValue(null);

      // When & Then
      await expect(userService.createUser(mockUser)).rejects.toThrow(
        "User creation failed"
      );
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(mockUser);
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
    });

    it("repository에서 에러가 발생하면 에러를 전파해야 한다", async () => {
      // Given
      const error = new Error("Database constraint violation");
      mockUserRepository.createUser.mockRejectedValue(error);

      // When & Then
      await expect(userService.createUser(mockUser)).rejects.toThrow(
        "Database constraint violation"
      );
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(mockUser);
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration scenarios", () => {
    it("동일한 사용자 정보로 조회와 생성을 연속으로 수행할 수 있어야 한다", async () => {
      // Given
      const userInput: UserLoginInput = { name: "이영희", birth: "970825" };
      const user: User = {
        groupId: 3,
        cellId: 1,
        name: "이영희",
        birth: "970825",
        gisu: 9,
        level: 1,
      };

      mockUserRepository.getUser.mockResolvedValue(undefined);
      mockUserRepository.createUser.mockResolvedValue([
        { insertId: 1, affectedRows: 1 },
      ]);
      mockUserRepository.getUser
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(user);

      // When
      const beforeCreate = await userService.fetchUser(userInput);
      await userService.createUser(user);
      const afterCreate = await userService.fetchUser(userInput);

      // Then
      expect(beforeCreate).toBeUndefined();
      expect(afterCreate).toEqual(user);
      expect(mockUserRepository.getUser).toHaveBeenCalledTimes(2);
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
    });
  });
});
