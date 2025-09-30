"use client";

import { User } from "@/types/user.type";
import { UserGrid } from "./UserGrid";
import { ModifyUserClient } from "./ModifyUserClient";
import { Modal } from "./Modal";
import { useRouter } from "next/navigation";
import styles from "./ManageClient.module.css";
import { ManageContextProvider, useManageContext } from "./ManageContext";
import { actionDelete } from "@/app/action/deleteAction";
import { useTransition } from "react";

interface ManageClientProps {
  users: User[];
}

function ManageClientInner({ users }: ManageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { selectedUser, handleModalOpen, handleModalClose, isOpen } =
    useManageContext();

  const handleEdit = (user: User) => {
    handleModalOpen(user);
  };

  const handleDelete = (user: User) => {
    const confirmed = confirm(`${user.name} 사용자를 정말 삭제하시겠습니까?`);
    if (confirmed) {
      doDelete(user);
    }
  };

  const doDelete = (user: User) => {
    startTransition(async () => {
      await actionDelete(user);
      router.refresh();
    });
  };

  const handleModify = () => {
    router.refresh();
    handleModalClose();
  };

  const getModalTitle = () =>
    selectedUser?.userId ? "팀원 정보 수정" : "팀원 등록";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>팀원 관리</h1>
      <div className={styles.header}>
        <p className={styles.teamInfo}>현재 총 팀원 : {users.length}명</p>
        <button
          onClick={() => handleModalOpen()}
          className={styles.registerBtn}
        >
          등록
        </button>
      </div>
      <UserGrid users={users} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal
        isOpen={isOpen}
        onClose={() => handleModalClose()}
        title={getModalTitle()}
      >
        <ModifyUserClient
          users={users}
          initialUserData={selectedUser}
          onUpdate={handleModify}
        ></ModifyUserClient>
      </Modal>
    </div>
  );
}

// Provider를 제공하는 외부 컴포넌트
export function ManageClient({ users }: ManageClientProps) {
  return (
    <ManageContextProvider>
      <ManageClientInner users={users} />
    </ManageContextProvider>
  );
}
