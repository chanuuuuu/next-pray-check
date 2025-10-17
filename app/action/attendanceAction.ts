"use server";
import { Attendance } from "@/types/attendance.type";
import { attendanceService } from "@/server/services/attendance.service";

export async function actionAttendance(
  inputAttendances: Attendance[]
): Promise<boolean> {
  try {
    const result = await attendanceService.modifyAttendances(inputAttendances);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}
