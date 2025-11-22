"use client";
import { User } from "@/types/user.type";
import { UserFormType } from "@/types/modify.type";
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";

interface ManageContextType {
  selectedUser?: UserFormType;
  handleModalOpen: (user?: User) => void;
  handleModalClose: () => void;
  isOpen: boolean;
}

const ManageContext = createContext<ManageContextType>({
  handleModalOpen: () => {},
  handleModalClose: () => {},
  isOpen: false,
});

export function ManageContextProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(
    () => ({
      selectedUser,
      isOpen,
      handleModalOpen,
      handleModalClose,
    }),
    [selectedUser, isOpen, handleModalOpen, handleModalClose]
  );

  return (
    <ManageContext.Provider value={value}>{children}</ManageContext.Provider>
  );
}

export function useManageContext() {
  const context = useContext(ManageContext);
  if (!context) {
    throw new Error("useCounter는 CounterProvider 안에서만 사용해야 합니다");
  }
  return context;
}
