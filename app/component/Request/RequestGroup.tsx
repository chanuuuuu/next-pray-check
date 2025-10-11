import { Request, RequestGroups } from "@/types/request.type";
import { CollapseButton } from "@/app/component/Common/CollapseButton";
import { actionRequestDelete } from "@/app/action/requestAction";
import { useRouter } from "next/navigation";
import styles from "./RequestGrid.module.css";

interface RequestGroupProps {
  group: RequestGroups;
  isCollapsed: boolean;
  handleCollapse: () => void;
}

export function RequestGroup({
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
          handleCollapse={handleCollapse}
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
}

export function RequestGridItem({ request }: { request: Request }) {
  const router = useRouter();

  const handleDeleteRequest = async (requestId: number) => {
    if (confirm("해당 기도제목을 삭제하시겠습니까?")) {
      await actionRequestDelete(requestId);
      router.refresh();
    }
  };

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
      <button
        className={styles.deleteBtn}
        onClick={() => handleDeleteRequest(request.requestId)}
        title="삭제"
      >
        🗑️
      </button>
    </div>
  );
}
