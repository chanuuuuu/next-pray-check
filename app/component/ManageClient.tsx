"use client";

import { User } from "@/types/user.type";
import { UserGrid } from "./UserGrid";
import { ModifyUserClient } from "./ModifyUserClient";
import { Modal } from "./Modal";
import { useRouter } from "next/navigation";
import styles from "./ManageClient.module.css";
import { ManageContextProvider, useManageContext } from "./ManageContext";

interface ManageClientProps {
  users: User[];
}

function ManageClientInner({ users }: ManageClientProps) {
  const router = useRouter();
  const {
    selectedUser,
    handleModalOpen,
    handleModalClose,
    isOpen,
    modifyType,
  } = useManageContext();

  const handleEdit = (user: User) => {
    handleModalOpen(user);
  };

  const handleDelete = (user: User) => {
    // TODO: 삭제 기능 구현
    const confirmed = confirm(`${user.name} 사용자를 정말 삭제하시겠습니까?`);
    if (confirmed) {
      console.log("Delete user:", user);
      alert("삭제 기능은 준비 중입니다.");
    }
  };

  const handleModify = () => {
    router.refresh();
    handleModalClose();
  };

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
        title="팀원 등록"
      >
        <ModifyUserClient
          users={users}
          initialUserData={selectedUser}
          onUpdate={handleModify}
          modifyType={modifyType}
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
