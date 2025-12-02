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
import { LightRayWrapper } from "../Common/ReactBits/ReactBitsWrapper";
import FadeContent from "@/app/component/Common/ReactBits/FadeContent";
import { useRouter } from "next/navigation";

interface RequestClientProps {
  requests: Request[];
  userId: number;
  cellId: number;
  initialFavoriteRequests: number[];
  handleRefresh?: () => void;
}

export function RequestClientInner({
  requests,
  initialFavoriteRequests,
  userId,
  cellId,
  handleRefresh,
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
        <div style={{ display: "flex", gap: "0.2rem" }}>
          <button
            onClick={() => setIsOpen(true)}
            className={styles.registerBtn}
          >
            등록
          </button>
          <button onClick={handleRefresh} className={styles.refreshBtn}>
            새로고침
          </button>
        </div>
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
  const [updateCount, setUpdateCount] = useState(1);
  const router = useRouter();

  function handleRefresh() {
    setUpdateCount((prev) => prev + 1);
    router.refresh();
  }

  return (
    <RequestContextProvider userId={userId}>
      <FadeContent
        key={updateCount}
        blur={false}
        duration={1000}
        easing="ease-out"
        initialOpacity={0.1}
      >
        <LightRayWrapper>
          <RequestClientInner
            requests={requests}
            initialFavoriteRequests={initialFavoriteRequests}
            userId={userId}
            cellId={cellId}
            handleRefresh={handleRefresh}
          />
        </LightRayWrapper>
      </FadeContent>
    </RequestContextProvider>
  );
}
