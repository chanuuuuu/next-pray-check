"use client";

import { User } from "@/types/user.type";
import { TeamGrid } from "./UserGrid";
import { ModifyUserClient } from "./ModifyUserClient";
import { Modal } from "@/app/component/Modal";
import { Button } from "@/app/component/ui/button";
import { useRouter } from "next/navigation";
import styles from "./ManageClient.module.css";
import { useManageModal } from "@/app/hooks/useManageModal";
import { actionDelete } from "@/app/action/registAction";
import { useTransition, useCallback } from "react";

type ManageClientProps = {
  users: User[];
};

export function ManageClient({ users }: ManageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { selectedUser, handleModalOpen, handleModalClose, isOpen } =
    useManageModal();

  const handleDelete = useCallback(
    (user: User) => {
      if (isPending) return;
      const confirmed = confirm(`${user.name}님을 정말 삭제하시겠습니까?`);
      if (confirmed) {
        startTransition(async () => {
          await actionDelete(user);
          router.refresh();
        });
      }
    },
    [router, isPending]
  );

  const handleModify = () => {
    if (isPending) return;
    router.refresh();
    handleModalClose();
  };

  const getModalTitle = () =>
    selectedUser?.userId ? "팀원 정보 수정" : "팀원 등록";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.teamInfo}>현재 총 팀원 : {users.length}명</p>
        <Button
          onClick={() => handleModalOpen()}
          variant="default"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="manage-modal"
        >
          등록
        </Button>
      </div>
      <TeamGrid
        users={users}
        onEdit={handleModalOpen}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => handleModalClose()}
        title={getModalTitle()}
      >
        <ModifyUserClient
          users={users}
          initialUserData={selectedUser}
          onUpdate={handleModify}
        />
      </Modal>
    </div>
  );
}
