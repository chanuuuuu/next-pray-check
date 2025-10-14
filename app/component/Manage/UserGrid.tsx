import { User } from "@/types/user.type";
import { LEVEL_OPTIONS } from "@/app/utils/constants";
import { getBirthDisplay } from "@/app/utils/clientUtils";
import styles from "./UserGrid.module.css";
import { getCells } from "@/app/utils/clientUtils";
import { memo } from "react";

interface UserGridProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserGrid({ users, onEdit, onDelete }: UserGridProps) {
  const getLevelLabel = (level: number): string => {
    const levelOption = Object.values(LEVEL_OPTIONS).find(
      (option) => option.value === level
    );
    return levelOption ? levelOption.label : "알 수 없음";
  };

  return (
    <div className={styles.userGrid}>
      {/* Header */}
      <div className={styles.gridHeader}>
        <div className={styles.headerCell}>이름 / 기수</div>
        <div className={styles.headerCell}>생일</div>
        <div className={styles.headerCell}>권한</div>
        <div className={styles.headerCell}>관리</div>
      </div>

      {/* Body */}
      <div className={styles.gridBody}>
        {users.map((user, index) => (
          <div key={`${user.name}-${index}`} className={styles.gridRow}>
            <div className={styles.cell}>
              {user.name} / {user.gisu}기
            </div>
            <div className={styles.cell}>{getBirthDisplay(user.birth)}</div>
            <div className={styles.cell}>{getLevelLabel(user.level)}</div>
            <div className={`${styles.cell} ${styles.actionsCell}`}>
              <button
                className={`${styles.iconBtn} ${styles.editBtn}`}
                onClick={() => onEdit?.(user)}
                type="button"
                title="수정"
              >
                ✏️
              </button>
              <button
                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                onClick={() => onDelete?.(user)}
                type="button"
                title="삭제"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className={styles.emptyState}>등록된 사용자가 없습니다.</div>
      )}
    </div>
  );
}

export const TeamGrid = memo(function TeamGrid({
  users,
  onEdit,
  onDelete,
}: UserGridProps) {
  const cells = getCells(users);
  return (
    <section>
      {cells.map((cell) => (
        <div key={cell.cellId} className={styles.cellSection}>
          <div className={styles.cellHeader}>
            <h3 className={styles.cellTitle}>{cell.cellId}조</h3>
            {cell.leaderName && (
              <span className={styles.leaderNames}>{cell.leaderName}</span>
            )}
          </div>
          <UserGrid users={cell.users} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </section>
  );
});
