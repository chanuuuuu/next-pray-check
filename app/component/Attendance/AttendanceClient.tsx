"use client";

import { Attendance } from "@/types/attendance.type";
import { useMemo, useState, useCallback, useTransition } from "react";
import { getCells } from "@/app/utils/clientUtils";
import { useRouter } from "next/navigation";
import { actionAttendance } from "@/app/action/attendanceAction";
import FadeContent from "@/app/component/Common/ReactBits/FadeContent";
import { BottomSheetSelect } from "@/app/component/Common/BottomSheetSelect";
import { motion } from "motion/react";

function hasAttendanceChanged(
  local: Attendance[],
  original: Attendance[],
): boolean {
  return local.some((localItem) => {
    const orig = original.find((a) => a.userId === localItem.userId);
    return (
      !orig ||
      localItem.worship !== orig.worship ||
      localItem.community !== orig.community
    );
  });
}

function AttendanceToggleButton({
  checked,
  onClick,
  disabled,
}: {
  checked: boolean | undefined;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-7 h-7 rounded-lg transition-all text-xs font-bold ${
        checked
          ? "bg-primary text-primary-foreground"
          : "glass text-muted-foreground/40"
      }`}
    >
      {checked ? "✓" : ""}
    </button>
  );
}

export default function AttendanceClient({
  attendances,
  myCellId,
}: {
  attendances: Attendance[];
  myCellId: number;
}) {
  const [localAttendances, setLocalAttendances] =
    useState<Attendance[]>(attendances);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedCellId, setSelectedCellId] = useState<number>(myCellId);
  const router = useRouter();

  const cells = useMemo(
    () => getCells<Attendance>(localAttendances),
    [localAttendances],
  );

  const selectedCell = useMemo(
    () => cells.find((c) => c.cellId === selectedCellId) ?? cells[0],
    [cells, selectedCellId],
  );

  const toggle = useCallback(
    (userId: number, field: "worship" | "community") => {
      setLocalAttendances((prev) =>
        prev.map((a) =>
          a.userId === userId ? { ...a, [field]: !a[field] } : a,
        ),
      );
    },
    [],
  );

  const handleRegist = () => {
    if (!hasAttendanceChanged(localAttendances, attendances)) {
      setStatusMessage("변경된 내용이 없습니다.");
      return;
    }

    setStatusMessage(null);
    startTransition(async () => {
      const result = await actionAttendance(localAttendances);
      if (result) {
        router.refresh();
        setStatusMessage("출석 등록 성공");
      } else {
        setStatusMessage("출석 등록 실패");
      }
    });
  };

  return (
    <FadeContent
      blur={false}
      duration={1000}
      easing="ease-out"
      initialOpacity={0.1}
    >
      <div className="min-h-screen bg-app-gradient pb-24">
        {/* 헤더 */}
        <div className="glass-strong sticky top-0 z-40 px-5 pt-3 pb-3 flex items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-foreground shrink-0">
            출석 관리
          </h1>
          <BottomSheetSelect
            options={cells.map((cell) => ({
              value: cell.cellId,
              label: `${cell.cellId}조${cell.leaderName ? ` ${cell.leaderName}` : ""}`,
            }))}
            value={selectedCellId}
            onChange={setSelectedCellId}
          />
        </div>

        {/* 조별 출석 목록 */}
        <div className="px-5 pt-4 pb-8">
          {selectedCell && (
            <motion.div
              key={selectedCell.cellId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                {selectedCell.cellId}조
                {selectedCell.leaderName ? ` — ${selectedCell.leaderName}` : ""}
              </h2>
              <div className="glass rounded-2xl overflow-hidden">
                {/* 헤더 행 */}
                <div className="flex items-center px-4 py-2 border-b border-border/50">
                  <span className="flex-1 text-[11px] font-medium text-muted-foreground">
                    이름
                  </span>
                  <span className="w-16 text-center text-[11px] font-medium text-muted-foreground">
                    대예배
                  </span>
                  <span className="w-16 text-center text-[11px] font-medium text-muted-foreground">
                    조모임
                  </span>
                </div>
                {/* 멤버 행 */}
                {selectedCell.users.map((user, i) => (
                  <div
                    key={user.userId}
                    className={`flex items-center px-4 py-3 ${
                      i < selectedCell.users.length - 1
                        ? "border-b border-border/30"
                        : ""
                    }`}
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">
                        {user.name}
                      </span>
                    </div>
                    <div className="w-16 flex justify-center">
                      <AttendanceToggleButton
                        checked={user.worship}
                        onClick={() => toggle(user.userId, "worship")}
                        disabled={isPending}
                      />
                    </div>
                    <div className="w-16 flex justify-center">
                      <AttendanceToggleButton
                        checked={user.community}
                        onClick={() => toggle(user.userId, "community")}
                        disabled={isPending}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* 하단 고정 등록 버튼 */}
        <div className="fixed bottom-20 left-0 right-0 z-40 px-5 flex flex-col items-center gap-2">
          {statusMessage && (
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRegist}
            disabled={isPending}
            className="w-full py-3 rounded-2xl text-sm font-semibold shadow-lg transition-all disabled:opacity-60"
            style={{
              background: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            {isPending ? "저장 중..." : "출석 등록"}
          </motion.button>
        </div>
      </div>
    </FadeContent>
  );
}
