import { User } from "@/types/user.type";
import { PropsWithChildren } from "react";
import styles from "./UserCard.module.css";
import { CollapseButton } from "./CollapseButton";

export interface UserCardProps {
  user: Pick<User, "userId" | "name" | "gisu">;
  isCollapsed: boolean;
  handleCollapse: (userId: number) => void;
}

export function UserCard({
  user,
  isCollapsed,
  handleCollapse,
  children,
}: PropsWithChildren<UserCardProps>) {
  return (
    <div key={user.userId} className={styles.userBubble}>
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <h4 className={styles.userName}>{user.name}</h4>
          <span className={styles.userGisu}>{user.gisu}기</span>
        </div>
        <CollapseButton
          isCollapsed={isCollapsed}
          handleCollapse={() => handleCollapse(user.userId)}
        />
      </div>
      <article
        className={`${styles.requestsList} ${
          isCollapsed ? styles.collapsed : ""
        }`}
      >
        {children}
      </article>
    </div>
  );
}
