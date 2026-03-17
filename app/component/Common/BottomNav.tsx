"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, ClipboardCheck, Users, LogOut } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { actionLogout } from "@/app/action/loginAction";
import styles from "./BottomNav.module.css";

type BottomNavProps = {
  userLevel: number;
};

type NavTab = {
  href: string;
  icon: React.ElementType;
  label: string;
  minLevel: number;
};

const NAV_TABS: NavTab[] = [
  { href: "/requests", icon: BookOpen, label: "기도제목", minLevel: 1 },
  { href: "/attendance", icon: ClipboardCheck, label: "출석", minLevel: 2 },
  { href: "/manage", icon: Users, label: "팀원", minLevel: 3 },
];

export function BottomNav({ userLevel }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    actionLogout();
    router.push("/login");
  }, [router]);

  const [isAtTop, setIsAtTop] = useState(true);
  const isRequestsPage = pathname === "/requests";

  useEffect(() => {
    if (!isRequestsPage) {
      setIsAtTop(true);
      return;
    }
    const scrollEl = document.getElementById("requests-scroll");
    if (!scrollEl) return;

    const handleScroll = () => {
      setIsAtTop(scrollEl.scrollTop <= 0);
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [isRequestsPage]);

  if (pathname === "/login") return null;

  const visibleTabs = NAV_TABS.filter((tab) => tab.minLevel <= userLevel);

  return (
    <nav className={`${styles.nav}${isRequestsPage && !isAtTop ? ` ${styles.navHidden}` : ""}`}>
      <div className={`glass-strong ${styles.inner}`}>
        {visibleTabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${styles.tab} ${active ? styles.tabActive : styles.tabInactive}`}
              aria-current={active ? "page" : undefined}
            >
              {active && <span className={styles.indicator} aria-hidden="true" />}
              <Icon className={styles.tabIcon} />
              <span className={styles.tabLabel}>{tab.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className={`${styles.tab} ${styles.tabInactive}`}
          aria-label="로그아웃"
        >
          <LogOut className={styles.tabIcon} />
          <span className={styles.tabLabel}>로그아웃</span>
        </button>
      </div>
      <div className="safe-bottom" />
    </nav>
  );
}
