import { AttendanceRepository } from "../dal/attendance.repository";
import { Attendance } from "@/types/attendance.type";
import { getWeekDay } from "@/app/utils/utils";

class AttendanceService {
  private attendanceRepository: AttendanceRepository;

  constructor(attendanceRepository?: AttendanceRepository) {
    this.attendanceRepository =
      attendanceRepository || new AttendanceRepository();
  }

  async getAttendances(groupId: number): Promise<Attendance[]> {
    const queryWeekId = await getWeekDay();
    return this.attendanceRepository.getAttendance(groupId, queryWeekId);
  }

  async modifyAttendances(attendances: Attendance[]): Promise<boolean> {
    try {
      const queryWeekId = await getWeekDay();
      const result = await this.attendanceRepository.modifyAttendance(
        attendances.map((attendance) => ({
          ...attendance,
          weekId: queryWeekId,
        }))
      );
      if (result) return true;
      throw new Error("Attendance modify failed");
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export const attendanceService = new AttendanceService();
