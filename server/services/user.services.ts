import { User, UserLoginInput } from "@/types/user.type";
import { UserRepository } from "../dal/user.repository";

const userRepository = new UserRepository();

export class UserService {
  async fetchUser(userInput: UserLoginInput): Promise<User | undefined> {
    return await userRepository.getUser(userInput);
  }

  async createUser(user: User): Promise<void> {
    const result = await userRepository.createUser(user);
    if (result) return;
    throw new Error("User creation failed");
  }
}

export const userService = new UserService();
