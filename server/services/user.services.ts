import { User, UserLoginInput } from "@/types/user.type";
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

  async createUser(user: User): Promise<void> {
    const result = await this.userRepository.createUser(user);
    if (result) return;
    throw new Error("User creation failed");
  }
}

export const userService = new UserService();
