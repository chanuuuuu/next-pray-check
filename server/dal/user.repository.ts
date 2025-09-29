import { Leader, User, UserLoginInput, UserRow } from "@/types/user.type";
import { sql } from "@/db/neon";
// 팀원 Data Access Layer
export class UserRepository {
  // init user table
  async initUserTable() {
    const userTable = await sql`
            CREATE TABLE IF NOT EXISTS users (
                user_id   SERIAL PRIMARY KEY,          -- 기본키 (자동 증가)
                group_id    INT NOT NULL,                -- 소속 그룹
                cell_id     INT NOT NULL,                -- 소속 셀
                name        VARCHAR(100) NOT NULL,       -- 이름
                birth       CHAR(6) NOT NULL,            -- 생년월일 (YYMMDD)
                level       INT NOT NULL,                -- 권한
                gisu        INT NOT NULL,                -- 기수
                created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 생성일
            )
        `;
    return userTable;
  }

  // create user
  async createUser(user: User) {
    const { groupId, cellId, name, birth, level, gisu } = user;
    const result = await sql`
            INSERT INTO users (group_id, cell_id, name, birth, level, gisu)
            VALUES (${groupId}, ${cellId}, ${name}, ${birth}, ${level}, ${gisu})
        `;
    return result;
  }

  // get user
  async getUser(userInput: UserLoginInput): Promise<User | undefined> {
    const { name, birth } = userInput;
    const user =
      await sql`SELECT * FROM users WHERE name = ${name} AND birth = ${birth}`;
    if (user && user.length > 0) {
      const userRow = user[0] as UserRow;
      return {
        userId: userRow?.user_id as number,
        groupId: userRow?.group_id as number,
        cellId: userRow?.cell_id as number,
        name: userRow?.name as string,
        birth: userRow?.birth as string,
        gisu: userRow?.gisu as number,
        level: userRow?.level as number,
      };
    }
    return undefined;
  }

  async getLeaders(groupId: number = 1): Promise<Leader[]> {
    const leaders =
      await sql`SELECT * FROM users WHERE group_id = ${groupId} AND level = 2`;
    return leaders.map((leader) => ({
      groupId: leader.group_id as number,
      cellId: leader.cell_id as number,
      name: leader.name as string,
      level: leader.level as number,
    }));
  }

  async getUsers(groupId: number): Promise<User[]> {
    const users =
      await sql`SELECT * FROM users WHERE group_id = ${groupId} ORDER BY cell_id, level DESC, user_id`;

    return users.map((user) => ({
      userId: user?.user_id as number,
      groupId: user?.group_id as number,
      cellId: user?.cell_id as number,
      name: user?.name as string,
      birth: user?.birth as string,
      gisu: user?.gisu as number,
      level: user?.level as number,
    }));
  }
}
