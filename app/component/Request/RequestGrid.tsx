import React, { useMemo, useState } from "react";
import { Request, RequestGroups } from "@/types/request.type";
import styles from "./RequestGrid.module.css";
import { RequestGroup } from "@/app/component/Request/RequestGroup";

interface RequestGridProps {
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
          <RequestGroup
            key={group.name}
            group={group}
            isCollapsed={isCollapsed}
            handleCollapse={() => toggleGroup(group.userId)}
          />
        );
      })}
    </div>
  );
}
