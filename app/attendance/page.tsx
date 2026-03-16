"use server";
import { verifySession } from "@/server/session";
import { redirect } from "next/navigation";
import { attendanceService } from "@/server/services/attendance.service";
import AttendanceClient from "@/app/component/Attendance/AttendanceClient";
import { Suspense } from "react";
import { AttendanceLoading } from "@/app/component/Attendance/AttendanceLoading";
import { getWeekDay } from "@/app/utils/utils";

export default async function Attendance() {
  const user = await verifySession();

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<AttendanceLoading />}>
      <AttendanceContent groupId={user.groupId} cellId={user.cellId} />
    </Suspense>
  );

}

async function AttendanceContent({
  groupId,
  cellId,
}: {
  groupId: number;
  cellId: number;
}) {
  const [attendances, weekId] = await Promise.all([
    attendanceService.getAttendances(groupId),
    getWeekDay(),
  ]);
  return <AttendanceClient attendances={attendances} myCellId={cellId} weekId={weekId} />;
}
