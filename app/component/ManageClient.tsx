"use client";

import { User } from "@/types/user.type";
import { UserGrid } from "./UserGrid";

interface ManageClientProps {
  users: User[];
}

export function ManageClient({ users }: ManageClientProps) {
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

  return (
    <div>
      <h1>팀원 관리</h1>
      <p>현재 총 팀원 : {users.length}명</p>
      <UserGrid users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
