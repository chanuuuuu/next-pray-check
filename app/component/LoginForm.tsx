export default async function LoginForm() {
  return (
    <form>
      <article>
        <h1>[2청 2진] 기도제목 한줄 나눔</h1>
        <section>
          <article>
            <label>이름</label>
            <input
              name="name"
              placeholder="이름을 입력하세요"
              required
              autoComplete="off"
              autoFocus
            />
          </article>
          <article>
            <label>비밀번호</label>
            <input
              name="password"
              placeholder="생년월일 6자리입니다"
              required
              autoComplete="off"
            />
          </article>
          {/* {error && (
            <div id={`error`}>
              {"[경고]"} {error}
            </div>
          )}
          <div>
            {isLoading && <span>로그인 중입니다..</span>}
         
          </div> */}
          <button type="submit">로그인</button>
        </section>
      </article>
    </form>
  );
}
