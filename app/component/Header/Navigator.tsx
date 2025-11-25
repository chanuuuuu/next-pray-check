"use client";

import { NavLink, LinkType } from "./NavLink";
import styles from "./Navigator.module.css";
import { actionLogout } from "@/app/action/loginAction";
import { useRouter, usePathname } from "next/navigation";

export function Navigator() {
  const router = useRouter();
  const pathname = usePathname();

  const links: LinkType[] = [
    { href: "/manage", name: "팀원 관리" },
    { href: "/requests", name: "기도제목" },
    { href: "/attendance", name: "출석등록" },
  ];

  const handleLogout = async () => {
    actionLogout();
    router.push("/login");
  };

  // 노출여부는 현재 페이지가 '/login'이 아닐 때만 노출
  const isLoginPage = pathname === "/login";
  if (isLoginPage) {
    return null;
  }

  return (
    <nav className={styles.navigator}>
      <ul className={styles.navList}>
        {links.map((link) => {
          return (
            <li key={link.name} className={styles.navItem}>
              <NavLink href={link.href} name={link.name} />
            </li>
          );
        })}
      </ul>
      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        ➜]
      </button>
    </nav>
  );
}
