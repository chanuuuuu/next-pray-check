export interface Attendance {
  attendanceId: number;
  userId: number;
  groupId: number;
  cellId: number;
  name: string;
  level: number;
  gisu: number;
  weekId?: number;
  worship?: boolean;
  community?: boolean;
  hasAttendance: boolean;
}
