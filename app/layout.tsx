import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/app/component/Common/AppShell";
import { Toaster } from "sonner";
import "./globals.css";

const pretendard = localFont({
  src: "../public/fonts/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

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
    <html lang="ko" className={pretendard.variable}>
      <body style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 0 }}>
          {children}
        </main>
        <AppShell />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
