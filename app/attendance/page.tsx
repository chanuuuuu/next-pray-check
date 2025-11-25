"use server";
import { verifySession } from "@/server/session";
import { redirect } from "next/navigation";
import { attendanceService } from "@/server/services/attendance.service";
import AttendanceClient from "@/app/component/Attendance/AttendanceClient";
import { Suspense } from "react";
import { AttendanceLoading } from "@/app/component/Attendance/AttendanceLoading";

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
  const attendances = await attendanceService.getAttendances(groupId);
  return (
    <section className="page">
      <AttendanceClient attendances={attendances} cellId={cellId} />
    </section>
  );
}
