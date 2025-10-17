"use client";

import { Attendance } from "@/types/attendance.type";
import { useMemo } from "react";
import { getCells } from "@/app/utils/clientUtils";
import { useState } from "react";
import { UserCard } from "@/app/component/Common/UserCard";
import { AttendanceForm } from "./AttendanceForm";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { actionAttendance } from "@/app/action/attendanceAction";
import styles from "./AttendanceClient.module.css";
import { CustomSelect } from "@/app/component/Common/CustomSelect";

export default function AttendanceClient({
  attendances,
  cellId,
}: {
  attendances: Attendance[];
  cellId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedCellId, setSelectedCellId] = useState<number>(cellId);
  const formRef = useRef<HTMLFormElement>(null);

  const cells = useMemo(() => getCells<Attendance>(attendances), [attendances]);
  const selectedCellUsers = useMemo(
    () => cells.find((cell) => cell.cellId === selectedCellId)?.users || [],
    [cells, selectedCellId]
  );

  const handleRegist = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    let isChanged = false;

    const inputAttendances: Attendance[] = selectedCellUsers.map((user) => {
      const value = {
        ...user,
        worship: formData.get(`worship-${user.userId}`) === "on",
        community: formData.get(`community-${user.userId}`) === "on",
      };
      if (
        user.worship !== value.worship ||
        user.community !== value.community
      ) {
        isChanged = true;
      }
      return value;
    });

    if (!isChanged) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    startTransition(async () => {
      const result = await actionAttendance(inputAttendances);
      if (result) {
        router.refresh();
        setTimeout(() => alert("출석 등록 성공"), 0);
      } else {
        setTimeout(() => alert("출석 등록 실패"), 0);
      }
    });
  };

  const selectOptions = useMemo(
    () =>
      cells.map((cell) => ({
        value: cell.cellId,
        label: `${cell.cellId}조 - ${cell.leaderName}`,
      })),
    [cells]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CustomSelect
          options={selectOptions}
          value={selectedCellId}
          onChange={setSelectedCellId}
          disabled={isPending}
        />
        <button
          onClick={handleRegist}
          disabled={isPending}
          className={styles.registerBtn}
        >
          출석 등록
        </button>
      </div>
      <form ref={formRef} className={styles.formContainer}>
        {selectedCellUsers.map((user) => (
          <UserCard key={user.userId} user={user} disableCollapseButton={true}>
            <AttendanceForm attendance={user} />
          </UserCard>
        ))}
      </form>
    </div>
  );
}
