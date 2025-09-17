"use client";

import { actionLogin } from "../action/userActions";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(actionLogin, {});

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
            {!pending && state?.error?.name && <p>{state?.error?.name}</p>}
          </article>
          <article>
            <label htmlFor="birth">생년월일</label>
            <input
              id="birth"
              name="birth"
              placeholder="생년월일 6자리입니다"
              autoComplete="off"
            />
            {!pending && state?.error?.birth && <p>{state?.error?.birth}</p>}
          </article>
        </section>
        <button type="submit" disabled={pending}>
          {pending ? "..." : "로그인"}
        </button>
      </article>
    </form>
  );
}
