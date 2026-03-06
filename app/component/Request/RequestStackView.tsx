"use client";

import { memo } from "react";
import { Request } from "@/types/request.type";
import { useRequestGroups } from "@/app/hooks/useRequestGroups";
import { StackCard } from "@/app/component/Request/RequestCard";
import Stack from "@/app/component/Common/ReactBits/Stack";
import styles from "./RequestStackView.module.css";

type RequestStackViewProps = {
  requests: Request[];
  toggleFavoriteRequest: (requestId: number) => void;
  getIsFavoriteRequest: (requestId: number) => boolean;
};

export const RequestStackView = memo(function RequestStackView({
  requests,
  toggleFavoriteRequest,
  getIsFavoriteRequest,
}: RequestStackViewProps) {
  const { requestGroups, collapsedGroups, handleCollapse } =
    useRequestGroups(requests);

  if (requestGroups.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>등록된 기도제목이 없습니다.</div>
      </div>
    );
  }

  const stackCards = requestGroups.map((group) => (
    <StackCard
      key={group.userId}
      group={group}
      isCollapsed={collapsedGroups.has(group.userId)}
      handleCollapse={handleCollapse}
      toggleFavoriteRequest={toggleFavoriteRequest}
      getIsFavoriteRequest={getIsFavoriteRequest}
    />
  ));

  return (
    <div className={styles.container}>
      <div className={styles.stackWrapper}>
        <Stack
          cards={stackCards}
          randomRotation={true}
          sensitivity={150}
          sendToBackOnClick={true}
          mobileClickOnly={false}
          animationConfig={{ stiffness: 180, damping: 24 }}
        />
      </div>
    </div>
  );
});
