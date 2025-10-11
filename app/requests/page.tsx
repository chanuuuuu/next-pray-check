"use server";

import { requestService } from "@/server/services/request.services";
import { verifySession } from "@/server/session";
import { redirect } from "next/navigation";
import { RequestClient } from "../component/Request/RequestClient";

export default async function Requests() {
  const user = await verifySession();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="page">
      <h1 className="title">팀 기도 제목</h1>
      <RequestPageContent groupId={user.groupId} userId={user.userId} />
    </section>
  );
}

async function RequestPageContent({
  groupId,
  userId,
}: {
  groupId: number;
  userId: number;
}) {
  const requests = await requestService.fetchRequests(groupId);

  return <RequestClient requests={requests} userId={userId} />;
}
