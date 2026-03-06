import type { Metadata } from "next";
import { AppShell } from "@/app/component/Common/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "한줄 기도제목 나눔",
  description: "기도제목을 나눕니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <main style={{ flex: 1, overflow: "hidden", paddingBottom: "5rem" }}>
          {children}
        </main>
        <AppShell />
      </body>
    </html>
  );
}
