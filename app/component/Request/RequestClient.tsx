"use client";

import { Request } from "@/types/request.type";
import { User } from "@/types/user.type";
import { useMemo, useState, useCallback } from "react";
import { RequestRegistForm } from "./RequestRegistForm";
import { RequestGrid } from "./RequestGrid";
import { RequestContextProvider } from "./RequestContext";
import { REQUEST_GROUP_OPTIONS } from "@/app/utils/constants";
import { useFavoriteRequest } from "@/app/hooks/useFavoriteRequest";
import { useRequestFilter } from "@/app/hooks/useRequestFilter";
import FadeContent from "@/app/component/Common/ReactBits/FadeContent";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Layers, List } from "lucide-react";
import styles from "./RequestClient.module.css";

type RequestClientProps = {
  requests: Request[];
  userId: number;
  cellId: number;
  initialFavoriteRequests: number[];
  initialPrayedUserIds: number[];
  users: User[];
};

function RequestClientInner({
  requests,
  initialFavoriteRequests,
  userId,
  cellId,
  users,
}: Omit<RequestClientProps, "initialPrayedUserIds">) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStackView, setIsStackView] = useState(true);
  const [targetUserId, setTargetUserId] = useState<number>(userId);

  const handleTargetUserChange = useCallback((id: number) => {
    setTargetUserId(id);
  }, []);

  const { favoriteRequests, toggleFavoriteRequest, getIsFavoriteRequest } =
    useFavoriteRequest({
      userId,
      initialFavoriteRequests,
    });

  const { selectedRequestType, conditionalRequests, handleRequestTypeChange } =
    useRequestFilter(requests, cellId, favoriteRequests);

  const insertId = useMemo(
    () =>
      requests.reduce((cur, request) => {
        if (request.userId === targetUserId) {
          return cur <= request.insertId ? request.insertId + 1 : cur;
        }
        return cur;
      }, 0),
    [requests, targetUserId],
  );

  const filterOptions = [
    { key: REQUEST_GROUP_OPTIONS.TEAM.value, label: "전체" },
    { key: REQUEST_GROUP_OPTIONS.CELL.value, label: "우리 조" },
    { key: REQUEST_GROUP_OPTIONS.FAVORITE.value, label: "즐겨찾기" },
  ];

  return (
    <div
      data-component="RequestClient"
      className={`h-dvh bg-app-gradient flex flex-col relative`}
    >
      {/* Header */}
      <div className={`glass-strong ${styles.header}`}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>기도제목</h1>
          <div className={`glass ${styles.viewToggle}`}>
            <button
              onClick={() => setIsStackView(true)}
              className={isStackView ? styles.viewBtnActive : styles.viewBtn}
              aria-label="스택 뷰"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsStackView(false)}
              className={!isStackView ? styles.viewBtnActive : styles.viewBtn}
              aria-label="리스트 뷰"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={styles.filterRow}>
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => handleRequestTypeChange(option.key)}
              className={
                selectedRequestType === option.key
                  ? styles.filterPillActive
                  : `glass ${styles.filterPill}`
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        id="requests-scroll"
        className="flex-1 overflow-y-auto px-5 pt-4"
        style={{ paddingBottom: "calc(var(--nav-height) + 1rem)" }}
      >
        {isStackView ? (
          <div className="overflow-hidden">
            <RequestGrid
              requests={conditionalRequests}
              toggleFavoriteRequest={toggleFavoriteRequest}
              getIsFavoriteRequest={getIsFavoriteRequest}
              isStackView={isStackView}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <RequestGrid
              requests={conditionalRequests}
              toggleFavoriteRequest={toggleFavoriteRequest}
              getIsFavoriteRequest={getIsFavoriteRequest}
              isStackView={isStackView}
            />
          </div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        className={styles.fab}
        onClick={() => setIsModalOpen(true)}
        whileTap={{ scale: 0.9 }}
        aria-label="기도제목 등록"
      >
        <Plus className="w-5 h-5 text-primary-foreground" />
      </motion.button>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.overlay}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={styles.bottomSheet}
            >
              <div className={`glass-strong ${styles.bottomSheetInner}`}>
                <h2 className={styles.modalTitle}>기도제목 등록</h2>
                <RequestRegistForm
                  insertId={insertId}
                  onClose={() => setIsModalOpen(false)}
                  users={users}
                  targetUserId={targetUserId}
                  onTargetUserChange={handleTargetUserChange}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Provider를 제공하는 외부 컴포넌트
export function RequestClient({
  requests,
  initialFavoriteRequests,
  initialPrayedUserIds,
  userId,
  cellId,
  users,
}: RequestClientProps) {
  return (
    <RequestContextProvider
      userId={userId}
      initialPrayedUserIds={initialPrayedUserIds}
    >
      <FadeContent
        blur={false}
        duration={1000}
        easing="ease-out"
        initialOpacity={0.1}
        className="h-full"
      >
        <RequestClientInner
          requests={requests}
          initialFavoriteRequests={initialFavoriteRequests}
          userId={userId}
          cellId={cellId}
          users={users}
        />
      </FadeContent>
    </RequestContextProvider>
  );
}
