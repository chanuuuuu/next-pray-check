"use client";

import { actionLogin, UserState } from "../action/loginAction";
import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    // Server Component는 server action을 전달한다.
    <form action={formAction}>
      <article>
        <h1>[2청] 기도제목 한줄 나눔</h1>
        <section>
          <article>
            <label htmlFor="name">이름</label>
            <input
              id="name"
              name="name"
              placeholder="이름을 입력하세요"
              autoComplete="off"
              autoFocus
            />
            {state.error?.name && <p>{state.error?.name}</p>}
          </article>
          <article>
            <label htmlFor="birth">생년월일</label>
            <input
              id="birth"
              name="birth"
              placeholder="생년월일 6자리입니다"
              autoComplete="off"
            />
            {state.error?.birth && <p>{state.error?.birth}</p>}
          </article>
        </section>
        {state.error?.user && <p>{state.error?.user}</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </article>
    </form>
  );
}
