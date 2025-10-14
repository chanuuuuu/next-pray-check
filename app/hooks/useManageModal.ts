import { useState, useCallback } from "react";
import { UserFormType } from "@/types/modify.type";
import { User } from "@/types/user.type";

export function useManageModal() {
  const [isOpen, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormType | undefined>(
    undefined
  );

  const handleModalOpen = useCallback((user?: User) => {
    const userFormType = user
      ? ({
          userId: user?.userId,
          name: user?.name || "",
          birth: user?.birth || "",
          cellId: user?.cellId || "",
          level: user?.level || "",
          groupId: user?.groupId || "",
        } as UserFormType)
      : undefined;
    setSelectedUser(userFormType);
    setOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    isOpen,
    selectedUser,
    handleModalOpen,
    handleModalClose,
  };
}
