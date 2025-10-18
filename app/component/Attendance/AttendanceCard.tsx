import { Attendance } from "@/types/attendance.type";
import { UserCard } from "@/app/component/Common/UserCard";
import { AttendanceForm } from "./AttendanceForm";

export function AttendanceCard({ attendance }: { attendance: Attendance }) {
  return (
    <UserCard user={attendance} disableCollapseButton={true}>
      <AttendanceForm attendance={attendance} />
    </UserCard>
  );
}
