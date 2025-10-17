import { sql } from "@/db/neon";
import { Attendance } from "@/types/attendance.type";

export class AttendanceRepository {
  async initAttendanceTable() {
    const attendanceTable = await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        attendance_id SERIAL PRIMARY KEY,
        user_id     INT NOT NULL REFERENCES users(user_id)       ON DELETE CASCADE, -- 사용자 FK
        week_id INT NOT NULL, -- 주차 ID
        worship BOOLEAN NOT NULL DEFAULT FALSE, -- 예배 출석
        community BOOLEAN NOT NULL DEFAULT FALSE, -- 조모임 출석
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 생성일
      )

      ALTER TABLE attendance
        ADD CONSTRAINT uq_attendance_user_week UNIQUE (user_id, week_id);
    `;
    return attendanceTable;
  }

  async getAttendance(groupId: number, weekId: number): Promise<Attendance[]> {
    const attendanceRows = await sql`
      SELECT 
        u.user_id,
        u.group_id,
        u.cell_id,
        u.name,
        u.level,
        u.gisu,
        a.week_id,
        COALESCE(a.worship, FALSE) as worship,
        COALESCE(a.community, FALSE) as community,
        CASE 
            WHEN a.attendance_id IS NOT NULL THEN TRUE 
            ELSE FALSE 
        END as has_attendance
        FROM users u
        LEFT JOIN attendance a 
        ON u.user_id = a.user_id 
        AND a.week_id = ${weekId}
        WHERE u.group_id = ${groupId}
        ORDER BY u.cell_id, u.level DESC, u.user_id;
    `;
    return attendanceRows.map((attendanceRow) => ({
      attendanceId: attendanceRow?.attendance_id as number,
      userId: attendanceRow?.user_id as number,
      groupId: attendanceRow?.group_id as number,
      cellId: attendanceRow?.cell_id as number,
      name: attendanceRow?.name as string,
      level: attendanceRow?.level as number,
      gisu: attendanceRow?.gisu as number,
      weekId: attendanceRow?.week_id as number | undefined,
      worship: attendanceRow?.worship as boolean,
      community: attendanceRow?.community as boolean,
      hasAttendance: attendanceRow?.has_attendance as boolean,
    }));
  }

  async modifyAttendance(attendances: Attendance[]): Promise<boolean> {
    const valuesClause = attendances
      .map(
        (attendance) =>
          `(${attendance.userId}, ${attendance.weekId}, ${attendance.worship}, ${attendance.community})`
      )
      .join(", ");

    const result = await sql`
     INSERT INTO attendance (user_id, week_id, worship, community)
        VALUES
        ${sql.unsafe(valuesClause)}
        ON CONFLICT (user_id, week_id)
        DO UPDATE SET
        worship   = EXCLUDED.worship,
        community = EXCLUDED.community
        RETURNING attendance_id;
    `;
    return result.length > 0 ? !!result[0] : false;
  }
}
