export default function RequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // requests 페이지는 자체 Nav Bar를 가지므로
  // 글로벌 레이아웃의 Header와 Footer를 숨기기 위해
  // 전체 뷰포트를 점유하는 레이아웃을 사용한다.
  return (
    <div className="fixed inset-0 z-10 bg-[#111827] overflow-hidden">
      {children}
    </div>
  );
}
