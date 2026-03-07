"use client";

import { actionLogin, UserState } from "../../action/loginAction";
import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import { motion } from "motion/react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(actionLogin, {
    error: undefined,
  } as UserState);

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/requests");
    }
  }, [state.success, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={styles.container}
    >
      {/* 로고 영역 */}
      <div className={styles.logoArea}>
        <div className={`glass ${styles.logoIcon}`}>
          <span className={styles.logoEmoji}>🙏</span>
        </div>
        <h1 className={styles.appTitle}>한줄 기도제목 나눔</h1>
      </div>

      {/* 폼 */}
      <form action={formAction} className={`glass ${styles.form}`}>
        <div className={styles.formField}>
          <label htmlFor="name" className={styles.label}>
            이름
          </label>
          <input
            id="name"
            name="name"
            placeholder="이름을 입력하세요"
            autoComplete="off"
            autoFocus
            className={styles.input}
          />
          {state.error?.name && (
            <p className={styles.error}>{state.error?.name}</p>
          )}
        </div>
        <div className={styles.formField}>
          <label htmlFor="birth" className={styles.label}>
            생년월일 (YYMMDD)
          </label>
          <input
            id="birth"
            name="birth"
            inputMode="numeric"
            placeholder="예: 980315"
            maxLength={6}
            autoComplete="off"
            className={styles.input}
          />
          {state.error?.birth && (
            <p className={styles.error}>{state.error?.birth}</p>
          )}
        </div>

        {state.error?.user && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.error}
            style={{ textAlign: "center" }}
          >
            {state.error?.user}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={styles.submitBtn}
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className={styles.footer}>등록된 팀원만 로그인할 수 있습니다</p>
    </motion.div>
  );
}
