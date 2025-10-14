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
      <h1 className="title">기도제목</h1>
      <RequestPageContent
        groupId={user.groupId}
        userId={user.userId}
        cellId={user.cellId}
      />
    </section>
  );
}

async function RequestPageContent({
  groupId,
  userId,
  cellId,
}: {
  groupId: number;
  userId: number;
  cellId: number;
}) {
  const [requests, favoriteRequests] = await Promise.all([
    requestService.fetchRequests(groupId),
    requestService.fetchFavoriteRequests(userId),
  ]);

  return (
    <RequestClient
      requests={requests}
      userId={userId}
      cellId={cellId}
      initialFavoriteRequests={favoriteRequests}
    />
  );
}
