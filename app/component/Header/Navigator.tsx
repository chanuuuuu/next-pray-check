"use client";

import { NavLink, LinkType } from "./NavLink";
import styles from "./Navigator.module.css";
import { actionLogout } from "@/app/action/loginAction";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/user.type";

export function Navigator({ user }: { user: User }) {
  const router = useRouter();
  const pathname = usePathname();

  const links: LinkType[] = [
    { href: "/requests", name: "기도제목🙏", level: 1 },
    { href: "/attendance", name: "출석등록🔖", level: 2 },
    { href: "/manage", name: "팀원 관리👥", level: 3 },
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

  // 권한에 따라 링크 미노출

  return (
    <nav className={styles.navigator}>
      <ul className={styles.navList}>
        {user &&
          links.map((link) => {
            if (user && link.level > user.level) {
              return null;
            }
            return (
              <li key={link.name} className={styles.navItem}>
                <NavLink href={link.href} name={link.name} level={link.level} />
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
