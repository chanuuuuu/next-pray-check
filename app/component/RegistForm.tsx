// 실제 사용자를 입력하는 창
"use client";
import { Leader } from "@/types/user.type";
import { LEVEL_OPTIONS } from "@/app/utils/constants";
import { useActionState } from "react";
import {
  actionRegist,
  RegistState,
  FormDataType,
} from "../action/registAction";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RegistForm({
  leaders,
  initialUserData,
}: {
  leaders: Leader[];
  initialUserData: FormDataType;
}) {
  const [state, formAction, isPending] = useActionState(actionRegist, {
    error: undefined,
    formData: initialUserData,
  } as RegistState);

  const router = useRouter();

  // 등록 성공 시 페이지 새로고침
  useEffect(() => {
    if (state.success) {
      alert("사용자가 성공적으로 등록되었습니다!");
      router.refresh(); // 서버 컴포넌트 데이터 새로고침
    }
  }, [state.success, router]);

  // error에 따라 focus 처리
  useEffect(() => {
    if (state.error?.name) {
      document.getElementById("name")?.focus();
    }
    if (state.error?.birth) {
      document.getElementById("birth")?.focus();
    }
    if (state.error?.cellId) {
      document.getElementById("cellId")?.focus();
    }
    if (state.error?.level) {
      document.getElementById("level")?.focus();
    }
  }, [state.error]);

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
          defaultValue={state.formData?.name || ""}
          key={state.success ? "name-reset" : "name-keep"}
        />
        {state.error?.name && (
          <p style={{ color: "red" }}>{state.error?.name}</p>
        )}
      </section>
      <section>
        <label htmlFor="birth">생년월일</label>
        <input
          id="birth"
          name="birth"
          placeholder="생년월일 6자리입니다"
          autoComplete="off"
          defaultValue={state.formData?.birth || ""}
          key={state.success ? "birth-reset" : "birth-keep"}
        />
        {state.error?.birth && (
          <p style={{ color: "red" }}>{state.error?.birth}</p>
        )}
      </section>
      <section style={{ display: "none" }}>
        <label htmlFor="groupId">그룹</label>
        <select id="groupId" name="groupId" defaultValue={1}>
          <option value="1">1</option>
        </select>
      </section>
      <section>
        <label htmlFor="cellId">셀</label>
        <select
          id="cellId"
          name="cellId"
          defaultValue={state.formData?.cellId || ""}
          key={state.success ? "cellId-reset" : "cellId-keep"}
        >
          {leaders.map((leader: Leader) => (
            <option key={leader.cellId} value={leader.cellId}>
              {leader.name}
            </option>
          ))}
        </select>
        {state.error?.cellId && (
          <p style={{ color: "red" }}>{state.error?.cellId}</p>
        )}
      </section>
      <section>
        <label htmlFor="level">권한</label>
        <select
          id="level"
          name="level"
          defaultValue={state.formData?.level || ""}
          key={state.success ? "level-reset" : "level-keep"}
        >
          {Object.values(LEVEL_OPTIONS).map(({ label }: { label: string }) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        {state.error?.level && (
          <p style={{ color: "red" }}>{state.error?.level}</p>
        )}
      </section>
      {state.error?.regist && <p>{state.error?.regist}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "등록 중..." : "등록"}
      </button>
    </form>
  );
}
