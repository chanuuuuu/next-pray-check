// 실제 사용자를 입력하는 창
import { RegistForm } from "../component/Regist/RegistForm";
import { getUserBySession } from "@/server/session";
import { redirect } from "next/navigation";
import { Leader } from "@/types/user.type";
import { userService } from "@/server/services/user.services";
import { UserFormType } from "@/types/modify.type";
import { LEVEL_OPTIONS } from "../utils/constants";

export default async function RegistPage() {
  const [leaders, user] = await Promise.all([
    userService.getLeaders(), // 직접 서비스 호출
    getUserBySession(),
  ]);

  if (!user) {
    redirect("/login");
  }

  let max = 1;
  const filteredLeaders = leaders.reduce((acc, leader) => {
    if (leader.cellId >= max) max = leader.cellId + 1;
    if (leader.groupId === user?.groupId) {
      const findLeader = acc.findIndex((l) => l.cellId === leader.cellId);
      if (findLeader > -1) {
        acc[findLeader] = {
          ...acc[findLeader],
          name: acc[findLeader].name + ", " + leader.name,
        };
      } else {
        acc.push(leader);
      }
    }
    return acc;
  }, [] as Leader[]);

  filteredLeaders.push({
    groupId: user?.groupId as number,
    cellId: max,
    name: "신규 등록",
    level: 2,
  } as Leader);

  const initialUserData = {
    cellId: filteredLeaders[0].cellId,
    level: LEVEL_OPTIONS.TEAM_MEMBER.label,
  } as UserFormType;

  return (
    <article>
      <h1>등록 페이지</h1>
      <RegistForm leaders={filteredLeaders} initialUserData={initialUserData} />
    </article>
  );
}
