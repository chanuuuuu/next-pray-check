// 실제 사용자를 입력하는 창
"use client";
import { Leader } from "@/types/user.type";
import { UserFormType } from "@/types/modify.type";
import { LEVEL_OPTIONS } from "@/app/utils/constants";
import { useActionState } from "react";
import { actionRegist, RegistState } from "@/app/action/registAction";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./RegistForm.module.css";

export function RegistForm({
  leaders,
  initialUserData,
  onUpdate,
}: {
  leaders: Leader[];
  initialUserData?: UserFormType;
  onUpdate?: () => void;
}) {
  const router = useRouter();
  const isRegist: boolean = !!!initialUserData?.userId;

  const [state, formAction, isPending] = useActionState(actionRegist, {
    error: undefined,
    placeholder: initialUserData,
    isRegist,
  } as RegistState);

  // 등록 성공 시 페이지 새로고침
  useEffect(() => {
    if (state.success) {
      if (!isRegist) {
        alert("사용자 정보가 성공적으로 변경되었습니다.");
      } else {
        alert("사용자가 성공적으로 등록되었습니다");
      }

      if (onUpdate) {
        onUpdate?.();
      } else {
        router.refresh(); // 서버 컴포넌트 데이터 새로고침
      }
    }
  }, [state.success, router, onUpdate, initialUserData, isRegist]);

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
    <form action={formAction} className={styles.container}>
      <section className={styles.formSection}>
        <label htmlFor="name" className={styles.label}>
          이름
        </label>
        <input
          id="name"
          name="name"
          className={styles.input}
          placeholder="이름을 입력하세요"
          autoComplete="off"
          autoFocus
          defaultValue={state.placeholder?.name || ""}
          key={state.success ? "name-reset" : "name-keep"}
        />
        {state.error?.name && (
          <p className={styles.errorMessage}>{state.error?.name}</p>
        )}
      </section>

      <section className={styles.formSection}>
        <label htmlFor="birth" className={styles.label}>
          생년월일
        </label>
        <input
          id="birth"
          name="birth"
          className={styles.input}
          placeholder="생년월일 6자리입니다"
          autoComplete="off"
          defaultValue={state.placeholder?.birth || ""}
          key={state.success ? "birth-reset" : "birth-keep"}
        />
        {state.error?.birth && (
          <p className={styles.errorMessage}>{state.error?.birth}</p>
        )}
      </section>

      <section className={styles.hiddenSection}>
        <label htmlFor="groupId" className={styles.label}>
          그룹
        </label>
        <select
          id="groupId"
          name="groupId"
          className={styles.select}
          defaultValue={1}
        >
          <option value="1">1</option>
        </select>
      </section>

      <section className={styles.formSection}>
        <label htmlFor="cellId" className={styles.label}>
          셀 리더
        </label>
        <select
          id="cellId"
          name="cellId"
          className={styles.select}
          defaultValue={state.placeholder?.cellId || leaders[0].cellId}
          key={state.success ? "cellId-reset" : "cellId-keep"}
        >
          {leaders.map((leader: Leader) => (
            <option key={leader.cellId} value={leader.cellId}>
              {leader.name}
            </option>
          ))}
        </select>
        {state.error?.cellId && (
          <p className={styles.errorMessage}>{state.error?.cellId}</p>
        )}
      </section>

      <section className={styles.formSection}>
        <label htmlFor="level" className={styles.label}>
          권한
        </label>
        <select
          id="level"
          name="level"
          className={styles.select}
          defaultValue={
            state.placeholder?.level || LEVEL_OPTIONS.TEAM_MEMBER.label
          }
          key={state.success ? "level-reset" : "level-keep"}
        >
          {Object.values(LEVEL_OPTIONS).map(({ label }: { label: string }) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        {state.error?.level && (
          <p className={styles.errorMessage}>{state.error?.level}</p>
        )}
      </section>

      {state.error?.regist && (
        <div className={styles.generalError}>{state.error?.regist}</div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={styles.submitButton}
      >
        {isPending ? "적용 중..." : "적용"}
      </button>
    </form>
  );
}
