"use client";

import { NavLink, LinkType } from "./NavLink";
import styles from "./Navigator.module.css";
import { actionLogout } from "@/app/action/loginAction";
import { useRouter } from "next/navigation";

export function Navigator() {
  const router = useRouter();

  const links: LinkType[] = [
    { href: "/manage", name: "팀원 관리" },
    { href: "/requests", name: "기도제목" },
  ];

  const handleLogout = async () => {
    await actionLogout();
    router.push("/login");
    router.refresh();
  };

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
        ⏻
      </button>
    </nav>
  );
}
