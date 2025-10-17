"use client";

import { Request } from "@/types/request.type";
import { useMemo, useState } from "react";
import { RequestRegistForm } from "./RequestRegistForm";
import { RequestGrid } from "./RequestGrid";
import { Modal } from "../Modal";
import styles from "./RequestClient.module.css";
import { RequestContextProvider } from "./RequestContext";
import { REQUEST_GROUP_OPTIONS } from "@/app/utils/constants";
import { useFavoriteRequest } from "@/app/hooks/useFavoriteRequest";
import { CustomSelect } from "@/app/component/Common/CustomSelect";

interface RequestClientProps {
  requests: Request[];
  userId: number;
  cellId: number;
  initialFavoriteRequests: number[];
}

export function RequestClientInner({
  requests,
  initialFavoriteRequests,
  userId,
  cellId,
}: RequestClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { favoriteRequests, toggleFavoriteRequest, getIsFavoriteRequest } =
    useFavoriteRequest({
      userId,
      initialFavoriteRequests,
    });
  const [selectedRequestType, setSelectedRequestType] = useState<number>(
    REQUEST_GROUP_OPTIONS.TEAM.value
  );

  const insertId = useMemo(
    () =>
      requests.reduce((cur, request) => {
        if (request.userId === userId) {
          return cur <= request.insertId ? request.insertId + 1 : cur;
        }
        return cur;
      }, 0),
    [requests, userId]
  );

  const conditionalRequests = useMemo(() => {
    switch (selectedRequestType) {
      case REQUEST_GROUP_OPTIONS.TEAM.value:
        return requests;
      case REQUEST_GROUP_OPTIONS.CELL.value:
        return requests.filter((request) => request.cellId === cellId);
      case REQUEST_GROUP_OPTIONS.FAVORITE.value:
        return requests.filter((request) =>
          favoriteRequests.includes(request.requestId)
        );
    }
    return requests;
  }, [requests, selectedRequestType, cellId, favoriteRequests]);

  function handleRequestTypeChange(value: number) {
    setSelectedRequestType(value);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CustomSelect
          options={Object.values(REQUEST_GROUP_OPTIONS).map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          value={selectedRequestType}
          onChange={handleRequestTypeChange}
        />

        <button onClick={() => setIsOpen(true)} className={styles.registerBtn}>
          등록
        </button>
      </div>
      <RequestGrid
        requests={conditionalRequests}
        toggleFavoriteRequest={toggleFavoriteRequest}
        getIsFavoriteRequest={getIsFavoriteRequest}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="기도제목 등록"
      >
        <RequestRegistForm
          insertId={insertId}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
}

// Provider를 제공하는 외부 컴포넌트
export function RequestClient({
  requests,
  initialFavoriteRequests,
  userId,
  cellId,
}: RequestClientProps) {
  return (
    <RequestContextProvider userId={userId}>
      <RequestClientInner
        requests={requests}
        initialFavoriteRequests={initialFavoriteRequests}
        userId={userId}
        cellId={cellId}
      />
    </RequestContextProvider>
  );
}
