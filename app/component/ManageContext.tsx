"use client";
import { User } from "@/types/user.type";
import { UserFormType } from "@/types/modify.type";
import { createContext, ReactNode, useState, useContext } from "react";

interface ManageContextProps {
  selectedUser?: UserFormType;
  handleModalOpen: (user?: User) => void;
  handleModalClose: () => void;
  isOpen: boolean;
}

const ManageContext = createContext<ManageContextProps>({
  handleModalOpen: () => {},
  handleModalClose: () => {},
  isOpen: false,
});

export function ManageContextProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormType | undefined>(
    undefined
  );

  const handleModalOpen = (user?: User) => {
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
  };

  const handleModalClose = () => setOpen(false);

  return (
    <ManageContext.Provider
      value={{
        selectedUser,
        isOpen,
        handleModalOpen,
        handleModalClose,
      }}
    >
      {children}
    </ManageContext.Provider>
  );
}

export function useManageContext() {
  const context = useContext(ManageContext);
  if (!context) {
    throw new Error("useCounter는 CounterProvider 안에서만 사용해야 합니다");
  }
  return context;
}
