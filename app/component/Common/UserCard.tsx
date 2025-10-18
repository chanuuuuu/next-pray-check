import { User } from "@/types/user.type";
import { PropsWithChildren } from "react";
import styles from "./UserCard.module.css";
import { CollapseButton } from "./CollapseButton";

export interface UserCardProps {
  user: Pick<User, "userId" | "name" | "gisu">;
  isCollapsed?: boolean;
  handleCollapse?: (userId: number) => void;
  disableCollapseButton?: boolean;
}

export function UserCard({
  user,
  isCollapsed = false,
  handleCollapse = () => {},
  children,
  disableCollapseButton = false,
}: PropsWithChildren<UserCardProps>) {
  return (
    <div key={user.userId} className={styles.userBubble}>
      <div
        className={styles.userHeader}
        onClick={() => !disableCollapseButton && handleCollapse(user.userId)}
      >
        <div className={styles.userInfo}>
          <h4 className={styles.userName}>{user.name}</h4>
          <span className={styles.userGisu}>{user.gisu}기</span>
        </div>
        {!disableCollapseButton && (
          <CollapseButton
            isCollapsed={isCollapsed}
            handleCollapse={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation(); // 이벤트 전파 중단
              handleCollapse(user.userId);
            }}
          />
        )}
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
