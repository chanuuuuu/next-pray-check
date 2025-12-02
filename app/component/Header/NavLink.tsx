// 네비게이터 역할의 헤더 구현
// 헤더는 특정 페이지에 대해서만 노출된다.
// 헤더는 클릭 및 hover시 노출되었다가 hover가 사라지면 노출되지 않는다.
// 노출 / 미노출 제어하는 로직은 구현하되, 디테일은 구현하지 않는다.
// header와 같이 사용자 상호작용이 필요한 경우에는 Server Component로 구현하지 않는다.
// link의 로딩은 의미가 없다. 넘어가는 레이아웃에서 로딩처리를 하는 것이 중요하다.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import styles from "./NavLink.module.css";

export interface LinkType {
  href: string;
  name: string;
  level: number;
}

export function NavLink({ href, name }: LinkType) {
  const pathname = usePathname();
  const router = useRouter();

  const active = useMemo<boolean>(() => {
    return href === pathname || pathname.startsWith(href);
  }, [pathname, href]);

  // TODO : active일 떄, 스타일 변경

  return (
    <Link
      href={href}
      onMouseEnter={() => router.prefetch(href)}
      onClick={(e) => active && e.preventDefault()}
      className={`${styles.navLink} ${active ? styles.active : ""}`}
    >
      {name}
    </Link>
  );
}
