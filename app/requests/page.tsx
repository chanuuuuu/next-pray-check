"use server";

import { requestService } from "@/server/services/request.services";
import { prayerCheckService } from "@/server/services/prayer_check.service";
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
    <div className="h-full overflow-hidden">
      <Suspense fallback={<RequestLoading />}>
        <RequestPageContent
          groupId={user.groupId}
          userId={user.userId}
          cellId={user.cellId}
        />
      </Suspense>
    </div>
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
  const [requests, favoriteRequests, prayedUserIds] = await Promise.all([
    requestService.fetchRequests(groupId),
    requestService.fetchFavoriteRequests(userId),
    prayerCheckService.getTodayCheckedTargets(userId),
  ]);

  return (
    <RequestClient
      requests={requests}
      userId={userId}
      cellId={cellId}
      initialFavoriteRequests={favoriteRequests}
      initialPrayedUserIds={prayedUserIds}
    />
  );
}
