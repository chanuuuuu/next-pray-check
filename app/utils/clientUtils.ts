import { User, Leader, Cell } from "@/types/user.type";

export function getBirthDisplay(birth: string): string {
  if (!birth || birth.length < 6) return "";
  return birth.slice(2);
}

export function getLeaders(users: User[]): Leader[] {
  let max = 1;
  const filteredLeaders = users.reduce((acc, user) => {
    const { name, level, cellId } = user;
    if (cellId >= max) max = cellId + 1;
    const findLeader = acc.findIndex((l) => l.cellId === user.cellId);
    if (findLeader > -1) {
      acc[findLeader] = {
        ...acc[findLeader],
        name: acc[findLeader].name + (level > 1 ? `, ${name}` : ""),
      };
    } else {
      acc.push({
        ...user,
        name: cellId + "조 " + (level > 1 ? `- ${name}` : ""),
      });
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

export function getCells(users: User[]): Cell[] {
  return users.reduce((_cells: Cell[], user: User) => {
    const existingCellIndex = _cells.findIndex(
      (cell) => cell.cellId === user.cellId
    );

    const { name, level } = user;
    if (existingCellIndex >= 0) {
      if (level > 1) {
        const { leaderName } = _cells[existingCellIndex];
        _cells[existingCellIndex].leaderName = leaderName
          ? `${leaderName},${name}`
          : name;
      }
      _cells[existingCellIndex].users.push(user);
    } else {
      const leaderName = level > 1 ? name : "";
      _cells.push({
        cellId: user.cellId,
        leaderName,
        users: [user],
      });
    }

    return _cells;
  }, [] as Cell[]);
}
