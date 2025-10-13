import { Request, RequestGroups } from "@/types/request.type";
import { CollapseButton } from "@/app/component/Common/CollapseButton";
import styles from "./RequestGrid.module.css";
import { memo } from "react";
import { useRequestContext } from "./RequestContext";

interface RequestGroupProps {
  group: RequestGroups;
  isCollapsed: boolean;
  handleCollapse: (userId: number) => void;
}

export const RequestGroup = memo(function RequestGroup({
  group,
  isCollapsed,
  handleCollapse,
}: RequestGroupProps) {
  return (
    <div key={group.userId} className={styles.userBubble}>
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <h4 className={styles.userName}>{group.name}</h4>
          <span className={styles.userGisu}>{group.gisu}기</span>
        </div>
        <CollapseButton
          isCollapsed={isCollapsed}
          handleCollapse={() => handleCollapse(group.userId)}
        />
      </div>
      <article
        className={`${styles.requestsList} ${
          isCollapsed ? styles.collapsed : ""
        }`}
      >
        {group.requests.map((request) => (
          <RequestGridItem key={request.requestId} request={request} />
        ))}
      </article>
    </div>
  );
});

export function RequestGridItem({ request }: { request: Request }) {
  const { handleDeleteRequest, isMyRequestGroup } = useRequestContext();

  const isMyRequest = isMyRequestGroup(request.userId);

  return (
    <div className={styles.requestItem}>
      <span className={styles.requestText}>{request.text}</span>
      <button
        className={styles.deleteBtn}
        style={{ display: "none" }} // 현재 비활성화
        title="즐겨찾기"
      >
        ☆
      </button>
      {isMyRequest && (
        <button
          className={styles.deleteBtn}
          onClick={() => handleDeleteRequest(request.requestId)}
          title="삭제"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
