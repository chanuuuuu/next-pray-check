"use client";

import { User } from "@/types/user.type";
import { getLeaders } from "@/app/utils/clientUtils";
import { UserFormType } from "@/types/modify.type";
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
}: ModifyUserClientProps) {
  const leaders = getLeaders(users);

  return (
    <RegistForm
      leaders={leaders}
      initialUserData={initialUserData}
      onUpdate={onUpdate}
    />
  );
}
