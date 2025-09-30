import type { Metadata } from "next";
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
      <body>
        {children}
        <footer className="app-footer">
          In their hearts humans plan their course, but the{" "}
          <strong>Lord</strong> establishes their steps.
        </footer>
      </body>
    </html>
  );
}
