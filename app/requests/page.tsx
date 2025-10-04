import { verifySession } from "@/server/session";
// 기도제목 목록을 노출하는 Server Component 구현하기
export default async function Requests() {
  // 이 동작은 middleware에서 처리하도록 하며, api에서도 사용하도록 한다.
  const user = await verifySession();

  return (
    <section className="page">
      <h1 className="title">팀 기도 제목</h1>
    </section>
  );
}
