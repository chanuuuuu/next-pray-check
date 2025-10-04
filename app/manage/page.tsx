// 유저의 목록 리스트를 노출하고, 수정 및 삭제를 수행한다.
import { userService } from "@/server/services/user.services";
import { getUserBySession } from "@/server/session";
import { redirect } from "next/navigation";
import { ManageClient } from "@/app/component/Manage/ManageClient";
import { ManageLoading } from "@/app/component/Manage/ManageLoading";
import { Suspense } from "react";
import styles from "./page.module.css";

export default async function Manage() {
  const user = await getUserBySession();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className={styles.pageContainer}>
      <h1 className={styles.title}>팀원 관리</h1>
      <Suspense fallback={<ManageLoading />}>
        <ManagePageContent groupId={user.groupId} />
      </Suspense>
    </section>
  );
}

async function ManagePageContent({ groupId }: { groupId: number }) {
  const users = await userService.fetchUsers(groupId);
  return <ManageClient users={users} />;
}
