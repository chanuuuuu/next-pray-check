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

  async fetchUsers(groupId: number): Promise<User[]> {
    return await this.userRepository.getUsers(groupId);
  }

  async createUser(user: User): Promise<boolean> {
    try {
      const result = await this.userRepository.createUser(user);
      if (result) return true;
      throw new Error("User create failed");
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async updateUser(user: User): Promise<boolean> {
    try {
      const result = await this.userRepository.updateUser(user);
      if (result) return true;
      throw new Error("User update failed");
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async modifyUser(user: User, isRegist: boolean): Promise<boolean> {
    if (isRegist) {
      return await this.createUser(user);
    } else {
      return await this.updateUser(user);
    }
  }

  async deleteUser(user: User): Promise<boolean> {
    try {
      const result = await this.userRepository.deleteUser(user);
      if (result) return true;
      throw new Error("User delete failed");
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  // 현재 리더 인원 조회
  async getLeaders(): Promise<Leader[]> {
    return await this.userRepository.getLeaders();
  }
}

export const userService = new UserService();
