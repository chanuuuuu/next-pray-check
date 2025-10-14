"use client";

import { User } from "@/types/user.type";
import { TeamGrid } from "./UserGrid";
import { ModifyUserClient } from "./ModifyUserClient";
import { Modal } from "@/app/component/Modal";
import { useRouter } from "next/navigation";
import styles from "./ManageClient.module.css";
import { useManageModal } from "@/app/hooks/useManageModal";
import { actionDelete } from "@/app/action/registAction";
import { useTransition, useCallback } from "react";

interface ManageClientProps {
  users: User[];
}

export function ManageClient({ users }: ManageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { selectedUser, handleModalOpen, handleModalClose, isOpen } =
    useManageModal();

  const handleDelete = useCallback(
    (user: User) => {
      const confirmed = confirm(`${user.name}님을 정말 삭제하시겠습니까?`);
      if (confirmed) {
        startTransition(async () => {
          await actionDelete(user);
          router.refresh();
        });
      }
    },
    [router]
  );

  const handleModify = () => {
    router.refresh();
    handleModalClose();
  };

  const getModalTitle = () =>
    selectedUser?.userId ? "팀원 정보 수정" : "팀원 등록";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.teamInfo}>현재 총 팀원 : {users.length}명</p>
        <button
          onClick={() => handleModalOpen()}
          className={styles.registerBtn}
        >
          등록
        </button>
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
