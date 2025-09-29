import { User, Leader } from "@/types/user.type";

export function getBirthDisplay(birth: string): string {
  if (!birth || birth.length < 6) return "";
  return birth.slice(2);
}

export function getLeaders(users: User[]): Leader[] {
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
  return filteredLeaders;
}
