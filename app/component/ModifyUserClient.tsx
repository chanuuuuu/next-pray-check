"use client";

import { User, Leader } from "@/types/user.type";
import { UserFormType } from "../action/registAction";
import { RegistForm } from "@/app/component/RegistForm";
import { LEVEL_OPTIONS } from "../utils/constants";

interface ModifyUserClientProps {
  users: User[];
  initialUserData: UserFormType;
  onUpdate?: () => void;
}

export function ModifyUserClient({
  users,
  initialUserData,
  onUpdate,
}: ModifyUserClientProps) {
  let max = 1;
  const filteredLeaders = users.reduce((acc, user) => {
    if (user.level !== 2) return acc;
    if (user.cellId >= max) max = user.cellId + 1;
    const findLeader = acc.findIndex((l) => l.cellId === user.cellId);
    if (findLeader > -1) {
      acc[findLeader] = {
        ...acc[findLeader],
        name: acc[findLeader].name + ", " + user.name,
      };
    } else {
      acc.push(user);
    }
    return acc;
  }, [] as Leader[]);

  filteredLeaders.push({
    groupId: users[0]?.groupId as number,
    cellId: max,
    name: "신규 등록",
    level: 2,
  } as Leader);

  if (initialUserData) {
    initialUserData = {
      cellId: filteredLeaders[0].cellId,
      level: LEVEL_OPTIONS.TEAM_MEMBER.label,
    } as UserFormType;
  }

  return (
    <RegistForm
      leaders={filteredLeaders}
      initialUserData={initialUserData}
      onUpdate={onUpdate}
    />
  );
}
