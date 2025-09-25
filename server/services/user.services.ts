import { Leader, User, UserLoginInput } from "@/types/user.type";
import { UserRepository } from "../dal/user.repository";

export class UserService {
  private userRepository: UserRepository;

  // 의존성 주입을 위한 생성자 추가
  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async fetchUser(userInput: UserLoginInput): Promise<User | undefined> {
    return await this.userRepository.getUser(userInput);
  }

  async createUser(user: User): Promise<boolean> {
    try {
      const result = await this.userRepository.createUser(user);
      if (result) return true;
      throw new Error("User creation failed");
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  // 현재 리더 인원 조회
  async getLeaders(): Promise<Leader[]> {
    return await this.userRepository.getLeaders();
  }

  async fetchUsers(groupId: number): Promise<User[]> {
    return await this.userRepository.getUsers(groupId);
  }
}

export const userService = new UserService();
