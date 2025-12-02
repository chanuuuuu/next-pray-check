"use client";

import { actionLogin, UserState } from "../../action/loginAction";
import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import ShinyText from "../Common/ReactBits/ShinyText";

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
    <div className={styles.container}>
      <h1 className={styles.title}>🖐팀 기도 나눔💕</h1>
      <form action={formAction} className={styles.form}>
        <section className={styles.formSection}>
          <div className={styles.formField}>
            <label htmlFor="name" className={styles.label}>
              <ShinyText speed={4} text="이름" />
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
              <ShinyText speed={4} text="생년월일" />
            </label>
            <input
              id="birth"
              name="birth"
              placeholder="생년월일 6자리입니다"
              autoComplete="off"
              className={styles.input}
            />
            {state.error?.birth && (
              <p className={styles.error}>{state.error?.birth}</p>
            )}
          </div>
        </section>
        {state.error?.user && (
          <p className={styles.error}>{state.error?.user}</p>
        )}
        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          <ShinyText speed={2} text={isPending ? "로그인 중..." : "로그인"} />
        </button>
      </form>
    </div>
  );
}
