import { Request, RequestGroup } from "@/types/request.type";
import styles from "./RequestGrid.module.css";
import { memo } from "react";
import { useRequestContext } from "./RequestContext";
import { UserCard } from "@/app/component/Common/UserCard";

interface RequestCardProps {
  group: RequestGroup;
  isCollapsed: boolean;
  handleCollapse: (userId: number) => void;
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
}

export const RequestCard = memo(function RequestCard({
  group,
  isCollapsed,
  handleCollapse,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
}: RequestCardProps) {
  return (
    <UserCard
      key={group.userId}
      user={group}
      isCollapsed={isCollapsed}
      handleCollapse={handleCollapse}
    >
      {group.requests.map((request) => (
        <RequestItem
          key={request.requestId}
          request={request}
          toggleFavoriteRequest={toggleFavoriteRequest}
          getIsFavoriteRequest={getIsFavoriteRequest}
        />
      ))}
    </UserCard>
  );
});

function RequestItem({
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
