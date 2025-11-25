"use server";

import { requestService } from "@/server/services/request.services";
import { verifySession } from "@/server/session";
import { redirect } from "next/navigation";
import { RequestClient } from "../component/Request/RequestClient";
import { Suspense } from "react";
import RequestLoading from "@/app/component/Request/RequestLoading";

export default async function Requests() {
  const user = await verifySession();

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<RequestLoading />}>
      <section className="page">
        <RequestPageContent
          groupId={user.groupId}
          userId={user.userId}
          cellId={user.cellId}
        />
      </section>
    </Suspense>
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
