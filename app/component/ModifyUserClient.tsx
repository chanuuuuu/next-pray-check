"use client";

import { User } from "@/types/user.type";
import { getLeaders } from "@/app/utils/clientUtils";
import { UserFormType } from "../action/registAction";
import { RegistForm } from "@/app/component/RegistForm";

interface ModifyUserClientProps {
  users: User[];
  initialUserData?: UserFormType;
  onUpdate?: () => void;
  modifyType?: string;
}

export function ModifyUserClient({
  users,
  initialUserData,
  onUpdate,
  modifyType,
}: ModifyUserClientProps) {
  const leaders = getLeaders(users);

  return (
    <RegistForm
      leaders={leaders}
      initialUserData={initialUserData}
      onUpdate={onUpdate}
      modifyType={modifyType}
    />
  );
}
