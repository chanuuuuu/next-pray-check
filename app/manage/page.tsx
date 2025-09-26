// 유저의 목록 리스트를 노출하고, 수정 및 삭제를 수행한다.
import { userService } from "@/server/services/user.services";
import { getUserBySession } from "@/server/session";
import { redirect } from "next/navigation";
import { ManageClient } from "../component/ManageClient";

export default async function Manage() {
  const user = await getUserBySession();

  if (!user) {
    redirect("/login");
  }

  const users = await userService.fetchUsers(user.groupId);

  // delete server action을 구현하여 해당 action을 props로 전달

  return <ManageClient users={users} />;
}
