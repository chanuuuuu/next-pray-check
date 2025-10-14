// 기도제목 Data Access Layer
import { Request, ModifyRequest } from "@/types/request.type";
import { sql } from "@/db/neon";

export class RequestRepository {
  async initPrayerTable() {
    const prayerTable = await sql`
        CREATE TABLE IF NOT EXISTS requests (
            request_id  SERIAL PRIMARY KEY,                          -- 요청 고유 ID
            user_id     INT NOT NULL REFERENCES users(user_id)       ON DELETE CASCADE, -- 사용자 FK
            week_id     INT NOT NULL,                                -- 주차 ID
            text        TEXT NOT NULL,                               -- 요청 내용
            insert_id   INT NOT NULL,                                -- 입력 그룹 ID
            created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  -- 생성일
        );

        -- requests: 조인키 + 범위 + 정렬을 한 번에
        CREATE INDEX IF NOT EXISTS idx_requests_user_week_req
        ON requests (user_id, week_id DESC, request_id DESC)
        INCLUDE (text);

        -- (2) users 테이블: group_id → user_id 조인 최적화
        CREATE INDEX IF NOT EXISTS idx_users_group_user
        ON users (group_id, user_id);

        CREATE TABLE IF NOT EXISTS request_status (
          request_id   INT PRIMARY KEY REFERENCES requests(request_id) ON DELETE CASCADE,
          is_urgent    BOOLEAN NOT NULL DEFAULT FALSE,
          is_solved    BOOLEAN NOT NULL DEFAULT FALSE,
          updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS request_favorites (
          user_id     INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          request_id  INT NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE,
          week_id     INT NOT NULL,  -- ← 추가 (좋아요 시점의 request의 week_id 스냅샷)
          created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, request_id)
        );
    `;
    return prayerTable;
  }

  // 현재 자신의 팀의 모든 기도제목 조회
  async getRequests(groupId: number, weekId: number): Promise<Request[]> {
    const requests = await sql`SELECT 
        r.request_id, 
        r.text, 
        r.week_id, 
        r.user_id, 
        u.name, 
        u.gisu, 
        u.cell_id, 
        r.insert_id, 
        COALESCE(s.is_urgent, FALSE) AS is_urgent,
        COALESCE(s.is_solved, FALSE) AS is_solved
      FROM requests r
      JOIN users u USING (user_id)
      LEFT JOIN request_status s USING (request_id)
      WHERE u.group_id = ${groupId}
        AND r.week_id >= ${weekId}
        AND s.is_solved = FALSE
      ORDER BY r.user_id, r.week_id DESC, r.request_id DESC, r.insert_id DESC;`;

    return requests.map((request) => ({
      requestId: request?.request_id as number,
      text: request?.text as string,
      weekId: request?.week_id as number,
      insertId: request?.insert_id as number,
      userId: request?.user_id as number,
      cellId: request?.cell_id as number,
      name: request?.name as string,
      gisu: request?.gisu as number,
      isUrgent: request?.is_urgent as boolean,
      isSolved: request?.is_solved as boolean,
    }));
  }

  async createRequests(requests: ModifyRequest[]) {
    if (requests.length === 0) return null;

    const valuesClause = requests
      .map(
        (req) =>
          `(${req.userId}, '${req.text.replace(/'/g, "''")}', 
        ${req.insertId}, ${req.weekId})`
      )
      .join(", ");

    const result = await sql`
    WITH inserted_request AS (
      INSERT INTO requests (user_id, text, insert_id, week_id)
      VALUES ${sql.unsafe(valuesClause)}
      RETURNING request_id
    )
    INSERT INTO request_status (request_id, is_urgent)
    SELECT request_id, ${requests[0].isUrgent}
    FROM inserted_request;
    `;

    return result;
  }

  // request_id를 기반으로 기도제목 삭제
  async deleteRequest(requestId: number): Promise<boolean> {
    const result = await sql`
      DELETE FROM requests
      WHERE request_id = ${requestId}
      RETURNING request_id;
    `;

    return result.length > 0 ? !!result[0] : false;
  }

  async getFavoriteRequests(userId: number, weekId: number): Promise<number[]> {
    const favorites = await sql`
      SELECT *
      FROM request_favorites
      WHERE user_id = ${userId}
        AND week_id >= ${weekId}
    `;

    return favorites.map((favorite) => favorite?.request_id as number);
  }

  async deleteFavoriteRequest(
    userId: number,
    requestId: number
  ): Promise<boolean> {
    console.log("deleteFavoriteRequest", userId, requestId);
    const result = await sql`
      DELETE FROM request_favorites
      WHERE user_id = ${userId}
        AND request_id = ${requestId}
      RETURNING request_id;
    `;

    return result.length > 0 ? !!result[0] : false;
  }

  async addFavoriteRequest(
    userId: number,
    requestId: number
  ): Promise<boolean> {
    const result = await sql`
      INSERT INTO request_favorites (user_id, request_id, week_id)
      SELECT ${userId}, r.request_id, r.week_id
      FROM requests r
      WHERE r.request_id = ${requestId}
      ON CONFLICT (user_id, request_id) DO NOTHING
      RETURNING request_id;
    `;

    return result.length > 0 ? !!result[0] : false;
  }
}
