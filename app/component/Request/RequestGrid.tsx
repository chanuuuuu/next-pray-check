import React, { useMemo, useState } from "react";
import { Request } from "@/types/request.type";
import styles from "./RequestGrid.module.css";

interface RequestGridProps {
  requests: Request[];
}

interface RequestGroups {
  userId: number;
  name: string;
  gisu: number;
  cellId: number;
  requests: Request[];
}

export function RequestGrid({ requests }: RequestGridProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
    new Set()
  );

  const requestGroups = useMemo(() => {
    return requests.reduce((arr, request) => {
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
  }, [requests]);

  const toggleGroup = (userId: number) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleDeleteRequest = (requestId: number) => {
    // TODO: 삭제 로직 구현
    console.log("Delete request:", requestId);
  };

  if (requestGroups.length === 0) {
    return (
      <div className={styles.requestGrid}>
        <div className={styles.emptyState}>등록된 기도제목이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.requestGrid}>
      {requestGroups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.userId);

        return (
          <div key={group.userId} className={styles.userBubble}>
            <div className={styles.userHeader}>
              <div className={styles.userInfo}>
                <h4 className={styles.userName}>{group.name}</h4>
                <span className={styles.userGisu}>{group.gisu}기</span>
              </div>
              <button
                className={styles.toggleBtn}
                onClick={() => toggleGroup(group.userId)}
                title={isCollapsed ? "펼치기" : "접기"}
              >
                <svg
                  className={`${styles.toggleIcon} ${
                    isCollapsed ? styles.collapsed : ""
                  }`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
            </div>
            <div
              className={`${styles.requestsList} ${
                isCollapsed ? styles.collapsed : ""
              }`}
            >
              {group.requests.map((request) => (
                <RequestGridItem
                  key={request.requestId}
                  request={request}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RequestGridItem({
  request,
  onDelete,
}: {
  request: Request;
  onDelete: (requestId: number) => void;
}) {
  return (
    <div className={styles.requestItem}>
      <span className={styles.requestText}>{request.text}</span>
      <button className={styles.deleteBtn} title="즐겨찾기">
        ☆
      </button>
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(request.requestId)}
        title="삭제"
      >
        🗑️
      </button>
    </div>
  );
}
