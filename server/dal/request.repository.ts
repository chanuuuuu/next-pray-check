// 기도제목 Data Access Layer
import { Request } from "@/types/request.type";
import { sql } from "@/db/neon";

export class RequestRepository {
  async initPrayerTable() {
    const prayerTable = await sql`
        CREATE TABLE IF NOT EXISTS requests (
            request_id  SERIAL PRIMARY KEY,                          -- 요청 고유 ID
            user_id     INT NOT NULL REFERENCES users(user_id)       ON DELETE CASCADE, -- 사용자 FK
            group_id    INT NOT NULL,                                -- 비정규화된 그룹 ID (users에서 복사)
            week_id     INT NOT NULL,                                -- 주차 ID
            text        TEXT NOT NULL,                               -- 요청 내용
            created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  -- 생성일
        );

        -- requests: 조인키 + 범위 + 정렬을 한 번에
        CREATE INDEX IF NOT EXISTS idx_requests_user_week_req
        ON requests (user_id, week_id DESC, request_id DESC)
        INCLUDE (text);

        -- (2) users 테이블: group_id → user_id 조인 최적화
        CREATE INDEX IF NOT EXISTS idx_users_group_user
        ON users (group_id, user_id);
    `;
    return prayerTable;
  }

  // 현재 자신의 팀의 모든 기도제목 조회
  async getRequests(groupId: number, weekId: number): Promise<Request[]> {
    const requests = await sql`
      SELECT request_id, text, week_id, user_id, group_id, name, gisu, cell_id
      FROM requests JOIN users USING (user_id)
      WHERE groupId = ${groupId}
      AND weekId >= ${weekId}
      ORDER BY memeberId, weekId DESC, request_id DESC;
    `;

    return requests.map((request) => ({
      requestId: request?.user_id as number,
      text: request?.text as string,
      weekId: request?.weekId as number,
      userId: request?.user_id as number,
      groupId: request?.group_id as number,
      cellId: request?.cell_id as number,
      name: request?.name as string,
      gisu: request?.gisu as number,
    }));
  }

  async createRequests() {}
}
