import { actionLogin } from "../action/userActions";

export default function LoginForm({ errorCode }: { errorCode: string }) {
  return (
    // Server Component는 server action을 전달한다.
    <form action={actionLogin}>
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
            {errorCode === "01" && <p>이름을 입력해주세요</p>}
          </article>
          <article>
            <label htmlFor="birth">생년월일</label>
            <input
              id="birth"
              name="birth"
              placeholder="생년월일 6자리입니다"
              autoComplete="off"
            />
            {errorCode === "02" && <p>생년월일을 입력해주세요</p>}
          </article>
        </section>
        <button type="submit">로그인</button>
      </article>
    </form>
  );
}
