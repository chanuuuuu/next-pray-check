import { Attendance } from "@/types/attendance.type";
import styles from "./AttendanceForm.module.css";

export function AttendanceForm({ attendance }: { attendance: Attendance }) {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.checkboxGroup}>
        <input
          id={`worship-${attendance.userId}`}
          type="checkbox"
          name={`worship-${attendance.userId}`}
          defaultChecked={attendance.worship}
        />
        <label htmlFor={`worship-${attendance.userId}`}>대예배 참석</label>
      </div>
      <div className={styles.checkboxGroup}>
        <input
          id={`community-${attendance.userId}`}
          type="checkbox"
          name={`community-${attendance.userId}`}
          defaultChecked={attendance.community}
        />
        <label htmlFor={`community-${attendance.userId}`}>조모임 참석</label>
      </div>
    </div>
  );
}
