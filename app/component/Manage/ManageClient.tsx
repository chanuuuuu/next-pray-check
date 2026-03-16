"use client";

import { User } from "@/types/user.type";
import { TeamGrid } from "./UserGrid";
import { ModifyUserClient } from "./ModifyUserClient";
import { useRouter } from "next/navigation";
import { useManageModal } from "@/app/hooks/useManageModal";
import { actionDelete } from "@/app/action/registAction";
import { useTransition, useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import FadeContent from "@/app/component/Common/ReactBits/FadeContent";
import { motion, AnimatePresence } from "motion/react";

type ManageClientProps = {
  users: User[];
};

export function ManageClient({ users }: ManageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { selectedUser, handleModalOpen, handleModalClose, isOpen } =
    useManageModal();
  const [pendingDeleteUser, setPendingDeleteUser] = useState<User | null>(null);

  const handleDelete = useCallback(
    (user: User) => {
      if (isPending) return;
      setPendingDeleteUser(user);
    },
    [isPending]
  );

  const confirmDelete = useCallback(() => {
    if (!pendingDeleteUser) return;
    const user = pendingDeleteUser;
    setPendingDeleteUser(null);
    startTransition(async () => {
      await actionDelete(user);
      router.refresh();
    });
  }, [pendingDeleteUser, router]);

  const handleModify = () => {
    if (isPending) return;
    router.refresh();
    handleModalClose();
  };

  const getModalTitle = () =>
    selectedUser?.userId ? "팀원 정보 수정" : "팀원 등록";

  return (
    <FadeContent blur={false} duration={1000} easing="ease-out" initialOpacity={0.1}>
      <div data-component="ManageClient" className="min-h-screen bg-app-gradient pb-24">
        {/* 헤더 */}
        <div className="glass-strong sticky top-0 z-40 px-5 pt-12 pb-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">팀원 관리</h1>
          <button
            onClick={() => handleModalOpen()}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls="manage-modal"
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 팀원 목록 */}
        <div className="px-5 pt-4 space-y-5">
          <TeamGrid users={users} onEdit={handleModalOpen} onDelete={handleDelete} />
        </div>

        {/* 삭제 확인 모달 */}
        <AnimatePresence>
          {pendingDeleteUser && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60]"
                style={{
                  background: "hsl(var(--foreground) / 0.2)",
                  backdropFilter: "blur(4px)",
                }}
                onClick={() => setPendingDeleteUser(null)}
              />
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-20"
              >
                <div className="glass-strong rounded-3xl p-5 max-w-lg mx-auto">
                  <h2 className="text-base font-bold text-foreground mb-1">
                    팀원 삭제
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    {pendingDeleteUser.name}님을 정말 삭제하시겠습니까?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPendingDeleteUser(null)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold glass text-foreground"
                    >
                      취소
                    </button>
                    <button
                      onClick={confirmDelete}
                      disabled={isPending}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-destructive text-destructive-foreground disabled:opacity-60"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Sheet 모달 (등록/수정) */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60]"
                style={{
                  background: "hsl(var(--foreground) / 0.2)",
                  backdropFilter: "blur(4px)",
                }}
                onClick={() => handleModalClose()}
              />
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-20"
                id="manage-modal"
              >
                <div className="glass-strong rounded-3xl p-5 max-w-lg mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-foreground">
                      {getModalTitle()}
                    </h2>
                    <button
                      onClick={() => handleModalClose()}
                      className="p-1 text-muted-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <ModifyUserClient
                    users={users}
                    initialUserData={selectedUser}
                    onUpdate={handleModify}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </FadeContent>
  );
}
