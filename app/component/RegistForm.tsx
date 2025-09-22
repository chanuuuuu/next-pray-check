// 실제 사용자를 입력하는 창
"use client";
import { Leader } from "@/types/user.type";
import { LEVEL_OPTIONS } from "@/app/utils/constants";
import { useActionState } from "react";
import { actionRegist, RegistState } from "../action/registAction";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RegistForm({ leaders }: { leaders: Leader[] }) {
  const [state, formAction, isPending] = useActionState(actionRegist, {
    error: undefined,
  } as RegistState);

  const router = useRouter();

  // 등록 성공 시 페이지 새로고침
  useEffect(() => {
    if (state.success) {
      // 성공 메시지 표시 후 페이지 새로고침
      alert("사용자가 성공적으로 등록되었습니다!");
      router.refresh(); // 서버 컴포넌트 데이터 새로고침
    }
  }, [state.success, router]);

  return (
    <form action={formAction}>
      <section>
        <label htmlFor="name">이름</label>
        <input
          id="name"
          name="name"
          placeholder="이름을 입력하세요"
          autoComplete="off"
          autoFocus
        />
        {state.error?.name && <p>{state.error?.name}</p>}
      </section>
      <section>
        <label htmlFor="birth">생년월일</label>
        <input
          id="birth"
          name="birth"
          placeholder="생년월일 6자리입니다"
          autoComplete="off"
        />
        {state.error?.birth && <p>{state.error?.birth}</p>}
      </section>
      <section style={{ display: "none" }}>
        <label htmlFor="groupId">그룹</label>
        <select id="groupId" name="groupId" defaultValue={1}>
          <option value="1">1</option>
        </select>
      </section>
      <section>
        <label htmlFor="cellId">셀</label>
        <select id="cellId" name="cellId">
          {leaders.map((leader: Leader) => (
            <option key={leader.cellId} value={leader.cellId}>
              {leader.name}
            </option>
          ))}
        </select>
        {state.error?.cellId && <p>{state.error?.cellId}</p>}
      </section>
      <section>
        <label htmlFor="level">권한</label>
        <select id="level" name="level" defaultValue={1}>
          {Object.keys(LEVEL_OPTIONS).map((level: string) => (
            <option key={level} value={level}>
              {LEVEL_OPTIONS[level as unknown as keyof typeof LEVEL_OPTIONS]}
            </option>
          ))}
        </select>
        {state.error?.level && <p>{state.error?.level}</p>}
      </section>
      {state.error?.regist && <p>{state.error?.regist}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "등록 중..." : "등록"}
      </button>
    </form>
  );
}
