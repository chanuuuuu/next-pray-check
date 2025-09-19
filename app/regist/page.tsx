// 실제 사용자를 입력하는 창
import { RegistForm } from "../component/RegistForm";

export default async function RegistPage() {
  // server 측에서는 반드시 Absolute URL을 사용해야 한다.
  const leaders = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/leaders`
  ).then((res) => res.json());

  return (
    <div>
      <RegistForm leaders={leaders} />
    </div>
  );
}
