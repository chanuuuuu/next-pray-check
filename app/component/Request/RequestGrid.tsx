import React, { useMemo, memo, useCallback, useState } from "react";
import { Request, RequestGroups } from "@/types/request.type";
import styles from "./RequestGrid.module.css";
import { RequestGroup } from "@/app/component/Request/RequestGroup";
import { useRequestContext } from "./RequestContext";

interface RequestGridProps {
  requests: Request[];
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
}

export const RequestGrid = memo(function RequestGrid({
  requests,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
}: RequestGridProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
    new Set()
  );
  const { deletedRequests } = useRequestContext();

  const handleCollapse = useCallback((userId: number) => {
    setCollapsedGroups((prev: Set<number>) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const requestGroups = useMemo(() => {
    return requests.reduce((arr, request) => {
      if (deletedRequests.has(request.requestId)) return arr;
      const group = arr.find((group) => group.userId === request.userId);
      if (!group) {
        arr.push({
          userId: request.userId,
          name: request.name,
          gisu: request.gisu,
          cellId: request.cellId,
          requests: [request],
        });
      } else {
        group.requests.push(request);
      }
      return arr;
    }, [] as RequestGroups[]);
  }, [requests, deletedRequests]);

  if (requestGroups.length === 0) {
    return (
      <div className={styles.requestGrid}>
        <div className={styles.emptyState}>등록된 기도제목이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.requestGrid}>
      {requestGroups.map((group) => (
        <RequestGroup
          key={group.userId}
          group={group}
          isCollapsed={collapsedGroups.has(group.userId)}
          handleCollapse={handleCollapse}
          toggleFavoriteRequest={toggleFavoriteRequest}
          getIsFavoriteRequest={getIsFavoriteRequest}
        />
      ))}
    </div>
  );
});
