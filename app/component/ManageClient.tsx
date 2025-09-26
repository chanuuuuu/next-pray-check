"use client";

import { useState } from "react";
import { User } from "@/types/user.type";
import { UserGrid } from "./UserGrid";
import { ModifyUserClient } from "./ModifyUserClient";
import { Modal } from "./Modal";
import { useRouter } from "next/navigation";
import styles from "./ManageClient.module.css";

interface ManageClientProps {
  users: User[];
}

export function ManageClient({ users }: ManageClientProps) {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const handleEdit = (user: User) => {
    // TODO: 수정 기능 구현
    console.log("Edit user:", user);
    alert(`${user.name} 사용자 수정 기능은 준비 중입니다.`);
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
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>팀원 관리</h1>
      <div className={styles.header}>
        <p className={styles.teamInfo}>현재 총 팀원 : {users.length}명</p>
        <button onClick={() => setOpen(true)} className={styles.registerBtn}>
          등록
        </button>
      </div>
      <UserGrid users={users} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isOpen} onClose={() => setOpen(false)} title="팀원 등록">
        <ModifyUserClient
          users={users}
          initialUserData={{}}
          onUpdate={handleModify}
        ></ModifyUserClient>
      </Modal>
    </div>
  );
}
