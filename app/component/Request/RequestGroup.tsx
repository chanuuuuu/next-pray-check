import { Request, RequestGroups } from "@/types/request.type";
import { CollapseButton } from "@/app/component/Common/CollapseButton";
import styles from "./RequestGrid.module.css";
import { memo } from "react";
import { useRequestContext } from "./RequestContext";

interface RequestGroupProps {
  group: RequestGroups;
  isCollapsed: boolean;
  handleCollapse: (userId: number) => void;
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
}

export const RequestGroup = memo(function RequestGroup({
  group,
  isCollapsed,
  handleCollapse,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
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
          <RequestGridItem
            key={request.requestId}
            request={request}
            toggleFavoriteRequest={toggleFavoriteRequest}
            getIsFavoriteRequest={getIsFavoriteRequest}
          />
        ))}
      </article>
    </div>
  );
});

export function RequestGridItem({
  request,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
}: {
  request: Request;
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
}) {
  const { handleDeleteRequest, isMyRequestGroup } = useRequestContext();
  const isMyRequest = isMyRequestGroup(request.userId);
  const isFavoriteRequest = getIsFavoriteRequest(request.requestId);
  return (
    <div className={styles.requestItem}>
      <span className={styles.requestText}>{request.text}</span>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.favoriteBtn} ${
            isFavoriteRequest ? styles.favorited : ""
          }`}
          title={isFavoriteRequest ? "즐겨찾기 해제" : "즐겨찾기"}
          onClick={() => toggleFavoriteRequest(request.requestId)}
          aria-pressed={isFavoriteRequest}
        />
        {isMyRequest && (
          <button
            className={styles.deleteBtn}
            onClick={() => handleDeleteRequest(request.requestId)}
            title="삭제"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
