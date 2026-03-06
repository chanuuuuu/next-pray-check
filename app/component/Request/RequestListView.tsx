"use client";

import { memo } from "react";
import { Request } from "@/types/request.type";
import { useRequestGroups } from "@/app/hooks/useRequestGroups";
import { ListCard } from "@/app/component/Request/RequestCard";
import { motion } from "motion/react";

type RequestListViewProps = {
  requests: Request[];
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
};

export const RequestListView = memo(function RequestListView({
  requests,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
}: RequestListViewProps) {
  const { requestGroups, collapsedGroups, handleCollapse } = useRequestGroups(requests);

  if (requestGroups.length === 0) {
    return (
      <div
        style={{
          padding: "5rem 0",
          textAlign: "center",
          color: "hsl(var(--muted-foreground))",
          fontSize: "0.875rem",
          borderRadius: "1rem",
          border: "1px dashed hsl(var(--border))",
          width: "100%",
        }}
      >
        등록된 기도제목이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requestGroups.map((group, i) => (
        <motion.div
          key={group.userId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <ListCard
            group={group}
            isCollapsed={collapsedGroups.has(group.userId)}
            handleCollapse={handleCollapse}
            toggleFavoriteRequest={toggleFavoriteRequest}
            getIsFavoriteRequest={getIsFavoriteRequest}
          />
        </motion.div>
      ))}
    </div>
  );
});
