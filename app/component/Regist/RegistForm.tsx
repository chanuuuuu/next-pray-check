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
import { BottomSheetSelect } from "@/app/component/Common/BottomSheetSelect";

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
        router.refresh();
      }
    }
  }, [state.success, router, onUpdate, initialUserData, isRegist]);

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
    <form data-component="RegistForm" action={formAction} className={styles.container}>
      <section className={styles.formSection}>
        <label htmlFor="name" className={styles.label}>이름</label>
        <input
          id="name"
          name="name"
          placeholder="이름을 입력하세요"
          autoComplete="off"
          autoFocus
          defaultValue={state.placeholder?.name || ""}
          key={state.success ? "name-reset" : "name-keep"}
          className={styles.input}
        />
        {state.error?.name && (
          <p className={styles.errorMessage}>{state.error?.name}</p>
        )}
      </section>

      <section className={styles.formSection}>
        <label htmlFor="birth" className={styles.label}>생년월일</label>
        <input
          id="birth"
          name="birth"
          inputMode="numeric"
          placeholder="생년월일 6자리입니다"
          autoComplete="off"
          maxLength={6}
          defaultValue={state.placeholder?.birth || ""}
          key={state.success ? "birth-reset" : "birth-keep"}
          className={styles.input}
        />
        {state.error?.birth && (
          <p className={styles.errorMessage}>{state.error?.birth}</p>
        )}
      </section>

      <section className={styles.hiddenSection}>
        <label htmlFor="groupId" className={styles.label}>그룹</label>
        <select id="groupId" name="groupId" className={styles.select} defaultValue={1}>
          <option value="1">1</option>
        </select>
      </section>

      <div className={styles.inlineRow}>
        <section className={`${styles.formSection} ${styles.inlineItem}`}>
          <label className={styles.label}>셀 리더</label>
          <BottomSheetSelect
            key={state.success ? "cellId-reset" : "cellId-keep"}
            name="cellId"
            options={leaders.map((leader: Leader) => ({
              value: leader.cellId,
              label: leader.name,
            }))}
            defaultValue={state.placeholder?.cellId || leaders[0].cellId}
          />
          {state.error?.cellId && (
            <p className={styles.errorMessage}>{state.error?.cellId}</p>
          )}
        </section>

        <section className={`${styles.formSection} ${styles.inlineItem}`}>
          <label className={styles.label}>권한</label>
          <BottomSheetSelect
            key={state.success ? "level-reset" : "level-keep"}
            name="level"
            options={Object.values(LEVEL_OPTIONS).map(({ label }) => ({
              value: label,
              label,
            }))}
            defaultValue={state.placeholder?.level || LEVEL_OPTIONS.TEAM_MEMBER.label}
          />
          {state.error?.level && (
            <p className={styles.errorMessage}>{state.error?.level}</p>
          )}
        </section>
      </div>

      {state.error?.regist && (
        <div className={styles.generalError}>{state.error?.regist}</div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={styles.submitBtn}
      >
        {isPending ? "적용 중..." : "적용"}
      </button>
    </form>
  );
}
