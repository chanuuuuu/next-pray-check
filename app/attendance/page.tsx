"use server";
import { verifySession } from "@/server/session";
import { redirect } from "next/navigation";
import { attendanceService } from "@/server/services/attendance.service";
import AttendanceClient from "@/app/component/Attendance/AttendanceClient";

export default async function Attendance() {
  const user = await verifySession();

  if (!user) {
    redirect("/login");
  }

  const attendances = await attendanceService.getAttendances(user.groupId);

  return (
    <section className="page">
      <h1 className="title">출석부</h1>
      <AttendanceClient attendances={attendances} cellId={user.cellId} />
    </section>
  );
}
