import { NavLink, LinkType } from "./NavLink";
import styles from "./Navigator.module.css";

export function Navigator() {
  const links: LinkType[] = [
    { href: "/manage", name: "팀원 관리" },
    { href: "/requests", name: "기도제목" },
  ];

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
    </nav>
  );
}
